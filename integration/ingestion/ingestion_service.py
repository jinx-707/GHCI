from __future__ import annotations

import logging
import re
from decimal import Decimal
from typing import IO

from sqlalchemy.orm import Session

from integration.db.models import Transaction
from integration.ingestion.csv_parser import parse_csv

logger = logging.getLogger(__name__)


def clean_description(desc: str) -> str:
    """Lowercase, strip and remove common noise from descriptions."""
    if desc is None:
        return ""
    s = desc.lower().strip()
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"[^a-z0-9\s/-]", "", s)
    return s


def classify_direction(amount: Decimal) -> str:
    return "credit" if amount > 0 else "debit"


def ingest_csv_to_db(db: Session, file_obj: IO, account_id: int, source_type: str = "csv") -> int:
    """Parse CSV, clean and insert into fact_transactions.

    Returns number of inserted records.
    """
    rows = parse_csv(file_obj, account_id)
    inserted = 0
    for r in rows:
        desc_clean = clean_description(r.get("description_raw", ""))
        direction = classify_direction(r.get("amount", Decimal("0.00")))

        txn = Transaction(
            account_id=r["account_id"],
            txn_date=r["txn_date"],
            description_raw=r["description_raw"],
            description_clean=desc_clean,
            amount=r["amount"],
            currency=r.get("currency", "INR"),
            direction=direction,
            source_type=source_type,
        )
        db.add(txn)
        inserted += 1

    db.commit()
    logger.info("Inserted %d transactions for account %s", inserted, account_id)
    return inserted
