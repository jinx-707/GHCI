from __future__ import annotations

from typing import Optional, List
from pydantic import BaseModel


class TransactionOut(BaseModel):
    transaction_id: int
    txn_date: str
    amount: float
    description: str
    category: Optional[str]


class MLItem(BaseModel):
    transaction_id: int
    text: str


class ApplyMLItem(BaseModel):
    transaction_id: int
    predicted_category: str
    confidence: float

