# FinCoachAI - Backend (Member 2)

This backend contains the multi-agent coordination engine, scenario simulator, and REST API to power the FinCoach prototype. It is designed to run offline inside a GitHub Codespace.

## How to run

1. Install dependencies: `pip install -r requirements.txt`
2. Place model files from Member 1 in `models/model.pkl` and `models/vectorizer.pkl` or use the dummy loader included for testing.
3. Run the server: `uvicorn api.server:app --reload --host 0.0.0.0 --port 8000`

## Endpoints

- `POST /predict` - Predict category for one or many transactions
- `POST /forecast` - Returns cashflow and forecast
- `POST /simulate` - Run a scenario simulation
- `POST /feedback` - Submit user corrections/feedback
- `GET  /health` - Health check
