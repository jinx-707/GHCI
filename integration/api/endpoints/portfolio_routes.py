from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from integration.api.deps import get_db_dep
from integration.pipelines.portfolio_aggregator import recompute_monthly_portfolio
from integration.db.models import Portfolio
from integration.api.schemas.portfolio_schema import PortfolioOut

router = APIRouter()


@router.post("/integration/users/{user_id}/portfolio/recompute")
def recompute(user_id: int, db: Session = Depends(get_db_dep)):
    recompute_monthly_portfolio(db, user_id)
    return {"status": "recomputed"}


@router.get("/integration/users/{user_id}/portfolio", response_model=List[PortfolioOut])
def get_portfolio(user_id: int, db: Session = Depends(get_db_dep)):
    rows = db.query(Portfolio).filter(Portfolio.user_id == user_id).order_by(Portfolio.month.desc()).all()
    return [
        PortfolioOut(
            month=r.month.isoformat(),
            total_income=float(r.total_income),
            total_expense=float(r.total_expense),
            savings=float(r.savings),
        )
        for r in rows
    ]
