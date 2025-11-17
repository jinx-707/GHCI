from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()

class FeedbackRequest(BaseModel):
    transaction_id: str
    merchant_name: str
    predicted_category: str
    user_corrected_category: str
    confidence_score: float

@router.post('/feedback')
async def feedback(req: FeedbackRequest):
    from fastapi import FastAPI
    app = FastAPI.get_current()
    # store in DB or append to file
    db = app.state.db
    # for prototype, append to feedback_logs table
    try:
        sess = db.get_session()
        from db.orm_models import FeedbackLog
        fl = FeedbackLog(
            transaction_id=req.transaction_id,
            merchant_name=req.merchant_name,
            predicted_category=req.predicted_category,
            user_corrected_category=req.user_corrected_category,
            confidence_score=req.confidence_score
        )
        sess.add(fl)
        sess.commit()
    except Exception as e:
        # fallback to file-based logging
        import json
        with open('feedback_log.json','a') as f:
            f.write(json.dumps(req.dict())+'\n')
    return {'status':'ok'}