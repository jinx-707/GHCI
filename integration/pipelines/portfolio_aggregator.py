from __future__ import annotations

from collections import defaultdict
from datetime import date
from decimal import Decimal
from typing import Dict

from sqlalchemy import select
from sqlalchemy.orm import Session

from integration.db.models import Account, Transaction, Portfolio


def _first_of_month(d: date) -> date:
    return date(d.year, d.month, 1)


def recompute_monthly_portfolio(db: Session, user_id: int) -> None:
    """Aggregate transactions by month and upsert into fact_portfolio."""
    stmt = (
        select(Transaction)
        .join(Account, Account.account_id == Transaction.account_id)
        .where(Account.user_id == user_id)
    )
    txns = list(db.execute(stmt).scalars().all())

    groups: Dict[date, Dict[str, Decimal]] = defaultdict(lambda: {"income": Decimal("0.00"), "expense": Decimal("0.00")})

    for t in txns:
        m = _first_of_month(t.txn_date)
        if t.direction == "credit":
            groups[m]["income"] += Decimal(t.amount)
        else:
            groups[m]["expense"] += Decimal(abs(t.amount))

    # Upsert
    for month, vals in groups.items():
        total_income = vals["income"]
        total_expense = vals["expense"]
        savings = total_income - total_expense

        existing = (
            db.query(Portfolio)
            .filter(Portfolio.user_id == user_id, Portfolio.month == month)
            .one_or_none()
        )
        if existing:
            existing.total_income = total_income
            existing.total_expense = total_expense
            existing.savings = savings
        else:
            p = Portfolio(
                user_id=user_id,
                month=month,
                total_income=total_income,
                total_expense=total_expense,
                savings=savings,
            )
            db.add(p)

    db.commit()
