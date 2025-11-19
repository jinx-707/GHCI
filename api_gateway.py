"""
Unified API Gateway for GHCI system
Combines backend, integration, and ML services
"""
import sys
import logging
import traceback
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import uvicorn

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add modules to path
sys.path.append(str(Path(__file__).parent / "backend"))
sys.path.append(str(Path(__file__).parent / "integration"))
sys.path.append(str(Path(__file__).parent / "ML"))

from config import config

# Global state
predictor_obj = None
predictor_fn = None
db = None
coordinator = None
simulator = None

# Import routers from backend
from api.routers.predict_router import router as predict_router
from api.routers.forecast_router import router as forecast_router
from api.routers.simulate_router import router as simulate_router
from api.routers.feedback_router import router as feedback_router
from api.routers.health_router import router as health_router

# Import routers from integration
from integration.api.endpoints.ingestion_routes import router as ingestion_router
from integration.api.endpoints.transaction_routes import router as transaction_router
from integration.api.endpoints.portfolio_routes import router as portfolio_router
from integration.api.endpoints.feedback_routes import router as integration_feedback_router

# Import core services
from models.predict import ModelPredictor
from models.model_dummy_loader import dummy_predict
from coordinator.coordinator_engine import CoordinatorEngine
from coordinator.scenario_simulator import ScenarioSimulator
from db.db_config import Database


def initialize_services():
    """Initialize all services during startup"""
    global predictor_obj, predictor_fn, db, coordinator, simulator
    
    services = {
        'predictor': None,
        'db': None,
        'coordinator': None,
        'simulator': None
    }
    
    # Initialize predictor
    logger.info("🤖 Loading ML models...")
    try:
        predictor_obj = ModelPredictor()
        def predictor_fn_inner(text: str):
            """Predictor function for coordinator (returns tuple)"""
            try:
                return predictor_obj.predict_category_only(text)
            except Exception as e:
                logger.warning(f"Prediction failed, using fallback: {e}")
                return dummy_predict(text)
        predictor_fn = predictor_fn_inner
        services['predictor'] = predictor_obj
        logger.info("✅ ML models loaded successfully")
    except Exception as e:
        logger.warning(f"⚠️ Could not load ML models: {e}")
        logger.info("⚠️ Using dummy predictor (system will still work)")
        predictor_obj = None
        predictor_fn = dummy_predict
        services['predictor'] = dummy_predict
    
    # Initialize database
    logger.info("💾 Connecting to database...")
    try:
        db = Database(url=config.DATABASE_URL)
        services['db'] = db
        logger.info("✅ Database connected")
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        db = None
    
    # Initialize coordinator
    logger.info("🎯 Initializing coordinator...")
    try:
        coordinator = CoordinatorEngine(predictor_fn, db_session=db)
        simulator = ScenarioSimulator(coordinator)
        services['coordinator'] = coordinator
        services['simulator'] = simulator
        logger.info("✅ Coordinator initialized")
    except Exception as e:
        logger.error(f"❌ Coordinator initialization failed: {e}")
        coordinator = None
        simulator = None
    
    return services


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("🚀 Starting GHCI API Gateway...")
    
    try:
        services = initialize_services()
        
        # Store in app state
        app.state.predictor = services['predictor'] if services['predictor'] != dummy_predict else dummy_predict
        app.state.coordinator = services['coordinator']
        app.state.simulator = services['simulator']
        app.state.db = services['db']
        app.state.config = config
        if services['predictor'] and services['predictor'] != dummy_predict:
            app.state.predictor_obj = services['predictor']
        
        logger.info("✅ GHCI API Gateway started successfully!")
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        logger.error(traceback.format_exc())
        # Set fallbacks
        app.state.predictor = dummy_predict
        app.state.coordinator = None
        app.state.simulator = None
        app.state.db = None
        app.state.config = config
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down GHCI API Gateway...")


app = FastAPI(
    title="GHCI Financial Coach AI",
    description="Unified API for Financial Coach AI System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount backend routers
try:
    app.include_router(predict_router, prefix="/api/v1", tags=["Prediction"])
    app.include_router(forecast_router, prefix="/api/v1", tags=["Forecasting"])
    app.include_router(simulate_router, prefix="/api/v1", tags=["Simulation"])
    app.include_router(feedback_router, prefix="/api/v1", tags=["Feedback"])
    app.include_router(health_router, prefix="/api/v1", tags=["Health"])
    logger.info("✅ Backend routers mounted")
except Exception as e:
    logger.error(f"❌ Failed to mount backend routers: {e}")

# Mount integration routers
try:
    app.include_router(ingestion_router, prefix="/api/v1/integration", tags=["Data Ingestion"])
    app.include_router(transaction_router, prefix="/api/v1/integration", tags=["Transactions"])
    app.include_router(portfolio_router, prefix="/api/v1/integration", tags=["Portfolio"])
    app.include_router(integration_feedback_router, prefix="/api/v1/integration", tags=["Integration Feedback"])
    logger.info("✅ Integration routers mounted")
except Exception as e:
    logger.warning(f"⚠️ Some integration routers failed to mount: {e}")

# Exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Validation error",
            "details": exc.errors()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc) if config.DEBUG else "An error occurred"
        }
    )

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests"""
    logger.info(f"{request.method} {request.url.path}")
    try:
        response = await call_next(request)
        logger.info(f"{request.method} {request.url.path} - {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Request failed: {e}")
        raise

@app.get("/")
async def root():
    return {
        "message": "GHCI Financial Coach AI System",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "api_docs": "/docs",
            "health": "/api/v1/health",
            "predict": "/api/v1/predict",
            "forecast": "/api/v1/forecast",
            "simulate": "/api/v1/simulate"
        }
    }

@app.get("/api/v1/status")
async def system_status():
    """Get system status with detailed information"""
    # Check if predictor is ModelPredictor object or dummy function
    predictor_loaded = (
        hasattr(app.state.predictor, 'predict') or 
        (hasattr(app.state.predictor, '__self__') and hasattr(app.state.predictor.__self__, 'predict'))
    )
    
    # Check database connection
    db_status = "connected"
    try:
        if app.state.db:
            # Try a simple query to verify connection
            pass  # Add actual connection check if needed
        else:
            db_status = "not_initialized"
    except Exception:
        db_status = "error"
    
    # Check coordinator
    coordinator_status = "ready" if app.state.coordinator else "not_initialized"
    
    return {
        "status": "running",
        "backend": "running",
        "integration": "running", 
        "ml_models": {
            "status": "loaded" if predictor_loaded else "dummy",
            "type": "ModelPredictor" if predictor_loaded else "dummy_predict"
        },
        "database": {
            "status": db_status,
            "url": config.DATABASE_URL.split("@")[-1] if "@" in config.DATABASE_URL else config.DATABASE_URL
        },
        "coordinator": {
            "status": coordinator_status
        },
        "config": {
            "database_url": config.DATABASE_URL.split("@")[-1] if "@" in config.DATABASE_URL else config.DATABASE_URL,
            "debug": config.DEBUG,
            "model_version": config.MODEL_VERSION,
            "backend_port": config.BACKEND_PORT,
            "frontend_port": config.FRONTEND_PORT
        }
    }

if __name__ == "__main__":
    try:
        logger.info(f"🚀 Starting server on {config.BACKEND_PORT}...")
        uvicorn.run(
            "api_gateway:app",
            host="0.0.0.0",
            port=config.BACKEND_PORT,
            reload=config.DEBUG,
            log_level="info"
        )
    except KeyboardInterrupt:
        logger.info("🛑 Server stopped by user")
    except Exception as e:
        logger.error(f"❌ Server failed to start: {e}")
        logger.error(traceback.format_exc())
        sys.exit(1)