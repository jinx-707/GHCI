from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

class ForecastRequest(BaseModel):
    transactions: List[Dict[str, Any]]
    months: int = 3

@router.post('/forecast')
async def forecast(req: ForecastRequest):
    from fastapi import FastAPI
    app = FastAPI.get_current()
    coordinator = app.state.coordinator
    result = coordinator.spending.forecast_cashflow(req.transactions, months=req.months)
    return result
