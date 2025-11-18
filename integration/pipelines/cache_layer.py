from __future__ import annotations

from functools import lru_cache
from typing import List

from sqlalchemy.orm import Session

from integration.pipelines.transaction_processor import fetch_recent_transactions


@lru_cache(maxsize=128)
def _cached_transactions_for_user(user_id: int):
    # placeholder - actual DB session cannot be cached here; wrapper will call this
    return None


def get_cached_transactions_for_user(db: Session, user_id: int, limit: int = 100) -> List[dict]:
    txns = fetch_recent_transactions(db, user_id, limit=limit)
    return [
        {
            "transaction_id": t.transaction_id,
            "txn_date": t.txn_date.isoformat(),
            "amount": float(t.amount),
            "description": t.description_clean or t.description_raw,
            "category": t.category_final or t.category_pred,
        }
        for t in txns
    ]


def clear_transaction_cache_for_user(user_id: int) -> None:
    try:
        _cached_transactions_for_user.cache_clear()
    except Exception:
        pass
