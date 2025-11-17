from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, List

router = APIRouter()

class SimulateRequest(BaseModel):
    transactions: List[Dict[str, Any]]
    scenario: str
    params: Dict[str, Any] = {}

@router.post('/simulate')
async def simulate(req: SimulateRequest):
    from fastapi import FastAPI
    app = FastAPI.get_current()
    simulator = app.state.simulator
    if req.scenario == 'reduce_category':
        category = req.params.get('category')
        percent = float(req.params.get('percent', 10))
        return simulator.simulate_category_reduction(req.transactions, category, percent)
    if req.scenario == 'income_change':
        delta = float(req.params.get('delta', 0))
        return simulator.simulate_income_change(req.transactions, delta)
    if req.scenario == 'reallocate':
        from_cat = req.params.get('from_cat')
        to_cat = req.params.get('to_cat')
        amount = float(req.params.get('amount',0))
        return simulator.simulate_budget_allocation_change(req.transactions, from_cat, to_cat, amount)
    raise HTTPException(status_code=400, detail='Unknown scenario')