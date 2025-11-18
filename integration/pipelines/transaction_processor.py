from __future__ import annotations

from typing import List

from sqlalchemy.orm import Session
from sqlalchemy import select

from integration.db.models import Account, Transaction, FeedbackLog


def fetch_recent_transactions(db: Session, user_id: int, limit: int = 100) -> List[Transaction]:
    stmt = (
        select(Transaction)
        .join(Account, Account.account_id == Transaction.account_id)
        .where(Account.user_id == user_id)
        .order_by(Transaction.txn_date.desc())
        .limit(limit)
    )
    return list(db.execute(stmt).scalars().all())


def fetch_unclassified_transactions(db: Session, limit: int = 500) -> List[Transaction]:
    stmt = select(Transaction).where(Transaction.category_pred == None).limit(limit)
    return list(db.execute(stmt).scalars().all())


def save_feedback(
    db: Session,
    transaction_id: int,
    predicted_category: str,
    corrected_category: str,
    confidence_score: float,
    feedback_source: str = "user_manual",
):
    fb = FeedbackLog(
        transaction_id=transaction_id,
        predicted_category=predicted_category,
        corrected_category=corrected_category,
        confidence_score=confidence_score,
        feedback_source=feedback_source,
    )
    db.add(fb)

    txn = db.get(Transaction, transaction_id)
    if txn:
        txn.category_final = corrected_category

    db.commit()
