from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from integration.api.deps import get_db_dep
from integration.pipelines.transaction_processor import fetch_unclassified_transactions, fetch_recent_transactions
from integration.pipelines.ml_payload_builder import build_ml_payload
from integration.api.schemas.transaction_schema import MLItem, ApplyMLItem, TransactionOut
from integration.db.models import Transaction

router = APIRouter()


@router.get("/integration/transactions/unclassified", response_model=List[MLItem])
def get_unclassified(limit: int = 500, db: Session = Depends(get_db_dep)):
    txns = fetch_unclassified_transactions(db, limit=limit)
    payload = build_ml_payload(txns)
    return payload


@router.post("/integration/transactions/apply-ml")
def apply_ml(items: List[ApplyMLItem], db: Session = Depends(get_db_dep)):
    for it in items:
        txn = db.get(Transaction, it.transaction_id)
        if not txn:
            continue
        txn.category_pred = it.predicted_category
        txn.ml_confidence = it.confidence
        if not txn.category_final:
            txn.category_final = it.predicted_category
    db.commit()
    return {"updated": len(items)}


@router.get("/integration/users/{user_id}/transactions", response_model=List[TransactionOut])
def get_user_transactions(user_id: int, limit: int = 100, db: Session = Depends(get_db_dep)):
    txns = fetch_recent_transactions(db, user_id, limit=limit)
    out = [
        TransactionOut(
            transaction_id=t.transaction_id,
            txn_date=t.txn_date.isoformat(),
            amount=float(t.amount),
            description=(t.description_clean or t.description_raw),
            category=(t.category_final or t.category_pred),
        )
        for t in txns
    ]
    return out
