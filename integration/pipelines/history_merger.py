from __future__ import annotations

from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session

from integration.db.models import Account, Transaction


def get_merged_history_for_user(db: Session, user_id: int) -> List[dict]:
    stmt = (
        select(Transaction)
        .join(Account, Account.account_id == Transaction.account_id)
        .where(Account.user_id == user_id)
        .order_by(Transaction.txn_date.asc())
    )
    rows = list(db.execute(stmt).scalars().all())
    out = []
    for r in rows:
        out.append(
            {
                "date": r.txn_date.isoformat(),
                "amount": float(r.amount),
                "direction": r.direction,
                "category_final": r.category_final,
            }
        )
    return out
