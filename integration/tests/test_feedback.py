from datetime import date
from decimal import Decimal

from integration.db.db import Base
from integration.db.models import Account, Transaction
from integration.pipelines.transaction_processor import save_feedback
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


def _setup_in_memory_db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    return Session()


def test_save_feedback_updates_transaction():
    db = _setup_in_memory_db()
    acct = Account(user_id=1, account_name="Test", account_type="savings")
    db.add(acct)
    db.commit()
    db.refresh(acct)

    t1 = Transaction(account_id=acct.account_id, txn_date=date(2025, 1, 10), description_raw="pay", amount=Decimal("1000"), direction="credit")
    db.add(t1)
    db.commit()
    db.refresh(t1)

    save_feedback(db, transaction_id=t1.transaction_id, predicted_category="other", corrected_category="salary", confidence_score=0.95)
    updated = db.get(Transaction, t1.transaction_id)
    assert updated.category_final == "salary"
