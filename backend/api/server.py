from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# import routers
from api.routers.predict_router import router as predict_router
from api.routers.forecast_router import router as forecast_router
from api.routers.simulate_router import router as simulate_router
from api.routers.feedback_router import router as feedback_router
from api.routers.health_router import router as health_router

from models.predict import ModelPredictor
from models.model_dummy_loader import dummy_predict
from coordinator.coordinator_engine import CoordinatorEngine
from coordinator.scenario_simulator import ScenarioSimulator
from db.db_config import Database

app = FastAPI(title='FinCoachAI Backend')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Mount routers
app.include_router(predict_router, prefix='/api')
app.include_router(forecast_router, prefix='/api')
app.include_router(simulate_router, prefix='/api')
app.include_router(feedback_router, prefix='/api')
app.include_router(health_router, prefix='/api')

# Initialize model predictor and coordinator

# If models available, ModelPredictor will load them; otherwise we will use dummy_predict
try:
    predictor_obj = ModelPredictor()
    def predictor_fn(text: str):
        try:
            return predictor_obj.predict(text)
        except Exception:
            return dummy_predict(text)
except Exception:
    predictor_fn = dummy_predict

# DB
DB = Database(url=os.environ.get('DATABASE_URL','sqlite:///./fincoach.db'))

# Coordinator and simulator
coordinator = CoordinatorEngine(predictor_fn, db_session=DB)
simulator = ScenarioSimulator(coordinator)

# attach to app state
app.state.predictor = predictor_fn
app.state.coordinator = coordinator
app.state.simulator = simulator
app.state.db = DB

if __name__ == '__main__':
    uvicorn.run('api.server:app', host='0.0.0.0', port=8000, reload=True)
