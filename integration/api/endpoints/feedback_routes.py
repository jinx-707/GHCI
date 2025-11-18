from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from integration.api.deps import get_db_dep
from integration.api.schemas.feedback_schema import FeedbackIn
from integration.pipelines.transaction_processor import save_feedback

router = APIRouter()


@router.post("/integration/feedback")
def post_feedback(item: FeedbackIn, db: Session = Depends(get_db_dep)):
    save_feedback(
        db,
        transaction_id=item.transaction_id,
        predicted_category=item.predicted_category,
        corrected_category=item.corrected_category,
        confidence_score=item.confidence_score,
        feedback_source="user_manual",
    )
    return {"status": "recorded"}
