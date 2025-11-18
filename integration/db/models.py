from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from .db import Base


class Account(Base):
    __tablename__ = "dim_accounts"

    account_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, index=True)
    account_name = Column(String(100))
    account_type = Column(String(50))
    currency = Column(String(10), default="INR")
    created_at = Column(DateTime, server_default=func.now())

    transactions = relationship("Transaction", back_populates="account")


class Transaction(Base):
    __tablename__ = "fact_transactions"

    transaction_id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey("dim_accounts.account_id"), nullable=False, index=True)
    txn_date = Column(Date, nullable=False)
    posted_at = Column(DateTime, server_default=func.now())
    description_raw = Column(Text, nullable=False)
    description_clean = Column(Text, nullable=True)
    amount = Column(Numeric(14, 2), nullable=False)
    currency = Column(String(10), default="INR")
    direction = Column(String(10))
    category_pred = Column(String(100), nullable=True)
    category_final = Column(String(100), nullable=True)
    ml_confidence = Column(Numeric(4, 2), nullable=True)
    source_type = Column(String(20))
    is_anomaly = Column(Boolean, default=False)

    account = relationship("Account", back_populates="transactions")
    feedbacks = relationship("FeedbackLog", back_populates="transaction")


class Portfolio(Base):
    __tablename__ = "fact_portfolio"
    __table_args__ = (UniqueConstraint("user_id", "month", name="uq_user_month"),)

    portfolio_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, index=True)
    month = Column(Date, nullable=False)
    total_income = Column(Numeric(14, 2), default=Decimal("0.00"))
    total_expense = Column(Numeric(14, 2), default=Decimal("0.00"))
    savings = Column(Numeric(14, 2), default=Decimal("0.00"))
    created_at = Column(DateTime, server_default=func.now())


class FeedbackLog(Base):
    __tablename__ = "feedback_logs"

    feedback_id = Column(Integer, primary_key=True, autoincrement=True)
    transaction_id = Column(Integer, ForeignKey("fact_transactions.transaction_id"), nullable=False)
    predicted_category = Column(String(100))
    corrected_category = Column(String(100))
    confidence_score = Column(Numeric(4, 2))
    feedback_source = Column(String(50))
    created_at = Column(DateTime, server_default=func.now())

    transaction = relationship("Transaction", back_populates="feedbacks")
