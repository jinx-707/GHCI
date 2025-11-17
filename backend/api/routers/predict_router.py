from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

class PredictRequest(BaseModel):
    merchant_name: str = ''
    description: str = ''
    transactions: List[Dict[str, Any]] = None

@router.post('/predict')
async def predict(req: PredictRequest):
    # Expect a predictor callable to be mounted on app state
    from fastapi import Request
    from fastapi import Depends
    from fastapi import FastAPI
    app = FastAPI.get_current()
    predictor = app.state.predictor
    if req.transactions:
        res = []
        for t in req.transactions:
            text = t.get('merchant_name') or t.get('description') or ''
            try:
                cat, conf = predictor(text)
            except Exception:
                # fallback dummy
                from models.model_dummy_loader import dummy_predict
                cat, conf = dummy_predict(text)
            out = {**t, 'predicted_category': cat, 'confidence': conf}
            res.append(out)
        return {'predictions': res}
    # single prediction
    text = req.merchant_name or req.description
    try:
        cat, conf = predictor(text)
    except Exception:
        from models.model_dummy_loader import dummy_predict
        cat, conf = dummy_predict(text)
    return {'merchant_name': text, 'predicted_category': cat, 'confidence': conf}