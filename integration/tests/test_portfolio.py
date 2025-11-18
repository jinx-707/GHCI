from datetime import date
from decimal import Decimal

from integration.db.db import Base
from integration.db.models import Account, Transaction, Portfolio
from integration.pipelines.portfolio_aggregator import recompute_monthly_portfolio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


def _setup_in_memory_db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    return Session()


def test_recompute_portfolio():
    db = _setup_in_memory_db()
    acct = Account(user_id=1, account_name="Test", account_type="savings")
    db.add(acct)
    db.commit()
    db.refresh(acct)

    t1 = Transaction(account_id=acct.account_id, txn_date=date(2025, 1, 10), description_raw="pay", amount=Decimal("1000"), direction="credit")
    t2 = Transaction(account_id=acct.account_id, txn_date=date(2025, 1, 12), description_raw="shop", amount=Decimal("-200"), direction="debit")
    db.add_all([t1, t2])
    db.commit()

    recompute_monthly_portfolio(db, user_id=1)
    rows = db.query(Portfolio).filter(Portfolio.user_id == 1).all()
    assert len(rows) == 1
    p = rows[0]
    assert float(p.total_income) == 1000.0
    assert float(p.total_expense) == 200.0
    assert float(p.savings) == 800.0
