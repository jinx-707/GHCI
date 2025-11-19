# 🚀 GHCI Quick Start Guide

## Starting the Backend

### Option 1: Using the Startup Script (Recommended)
```bash
./start_backend.sh
```

This script will:
- ✅ Check Python version (requires 3.9+)
- ✅ Clean up existing processes on port 8000
- ✅ Verify dependencies are installed
- ✅ Check numpy/scikit-learn compatibility
- ✅ Start the API gateway

### Option 2: Direct Python Command
```bash
python3 api_gateway.py
```

### Option 3: Using uvicorn
```bash
uvicorn api_gateway:app --host 0.0.0.0 --port 8000 --reload
```

## What You'll See

When the backend starts successfully, you'll see:
```
🚀 Starting GHCI API Gateway...
🤖 Loading ML models...
✅ ML models loaded successfully
💾 Connecting to database...
✅ Database connected
🎯 Initializing coordinator...
✅ Coordinator initialized
✅ GHCI API Gateway started successfully!
```

## Access Points

Once started, the backend is available at:

- **API Base**: `http://localhost:8000`
- **Interactive API Docs**: `http://localhost:8000/docs` (Swagger UI)
- **Alternative Docs**: `http://localhost:8000/redoc` (ReDoc)
- **Health Check**: `http://localhost:8000/api/v1/health`
- **System Status**: `http://localhost:8000/api/v1/status`

## Testing the Backend

### Quick Health Check
```bash
curl http://localhost:8000/api/v1/health
```

### Check System Status
```bash
curl http://localhost:8000/api/v1/status
```

### Test Prediction
```bash
curl -X POST http://localhost:8000/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Coffee shop purchase", "amount": 500}'
```

## Features

### ✨ What's New
- **Better Error Handling**: Comprehensive error handling with fallbacks
- **Logging**: Detailed logging for debugging
- **Graceful Startup**: Services initialize independently with fallbacks
- **Health Monitoring**: Detailed status endpoints
- **Request Logging**: All requests are logged
- **Validation**: Proper input validation with helpful error messages

### 🔧 System Capabilities
- **ML Predictions**: Transaction categorization and fraud detection
- **Financial Forecasting**: Cash flow predictions
- **Scenario Simulation**: "What-if" analysis
- **Data Integration**: CSV/SMS transaction import
- **Portfolio Management**: Multi-account aggregation
- **Feedback Loop**: ML model improvement through user feedback

## Troubleshooting

### Port 8000 Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### NumPy/SciKit-Learn Compatibility Issue
```bash
pip3 uninstall -y numpy scikit-learn
pip3 install "numpy>=1.26.0,<2.0.0" scikit-learn==1.2.2
```

### Missing Dependencies
```bash
pip3 install -r requirements.txt
```

### Models Won't Load
- The system will automatically fall back to dummy predictions
- Check logs for specific error messages
- Models might need to be re-trained with current numpy version

## Next Steps

1. **Start Frontend**: Run `cd frontend && npm run dev`
2. **View API Docs**: Visit `http://localhost:8000/docs`
3. **Test Endpoints**: Use the interactive API documentation
4. **Read Logs**: Check console output for detailed information

## Support

For issues or questions:
- Check logs in the console output
- Review the API documentation at `/docs`
- Check system status at `/api/v1/status`

