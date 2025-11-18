from __future__ import annotations

from pydantic import BaseModel


class FeedbackIn(BaseModel):
    transaction_id: int
    predicted_category: str
    corrected_category: str
    confidence_score: float
