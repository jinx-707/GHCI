from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from .db_config import Base

class Transaction(Base):
    __tablename__ = 'fact_transactions'
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=False, index=True)
    merchant_name = Column(String)
    description = Column(Text)
    amount = Column(Float)
    currency = Column(String, default='INR')
    date = Column(String)
    type = Column(String) # credit/debit
    predicted_category = Column(String, default=None)
    confidence = Column(Float, default=0.0)

class FeedbackLog(Base):
    __tablename__ = 'feedback_logs'
    id = Column(Integer, primary_key=True)
    transaction_id = Column(String)
    merchant_name = Column(String)
    predicted_category = Column(String)
    user_corrected_category = Column(String)
    confidence_score = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
