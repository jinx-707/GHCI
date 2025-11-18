from __future__ import annotations

import csv
from datetime import datetime
from decimal import Decimal
from typing import IO, List, Dict


def _parse_date(value: str):
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(value.strip(), fmt).date()
        except Exception:
            continue
    raise ValueError(f"Unknown date format: {value}")


def parse_csv(file_obj: IO, account_id: int) -> List[Dict]:
    """Read a CSV file-like object and return normalized transactions.

    Expected columns: Date, Description, Amount
    """
    reader = csv.DictReader(file_obj)
    out = []
    for row in reader:
        if not row:
            continue
        date_raw = row.get("Date") or row.get("date") or row.get("Txn Date")
        desc = row.get("Description") or row.get("description") or row.get("Narration") or ""
        amt_raw = row.get("Amount") or row.get("amount") or row.get("Txn Amount") or "0"

        try:
            txn_date = _parse_date(date_raw)
        except Exception:
            # skip rows with bad date
            continue

        try:
            amount = Decimal(str(amt_raw).replace(",", "").strip())
        except Exception:
            amount = Decimal("0.00")

        out.append(
            {
                "account_id": account_id,
                "txn_date": txn_date,
                "description_raw": desc.strip(),
                "amount": amount,
                "currency": "INR",
                "source_type": "csv",
            }
        )

    return out
