from __future__ import annotations

from typing import List
from pydantic import BaseModel


class PortfolioOut(BaseModel):
    month: str
    total_income: float
    total_expense: float
    savings: float
