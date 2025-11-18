from __future__ import annotations

import re
from datetime import date
from decimal import Decimal
from typing import Dict, Optional


def parse_sms(text: str, account_id: int) -> Optional[Dict]:
    """Very small rule-based SMS parser.

    Example SMS patterns (simplified):
      "Your a/c XXXX credited with INR 1,000 on 01-01-2025"
    """
    if not text:
        return None

    amt_match = re.search(r"([0-9,]+\.?[0-9]*)", text.replace("INR", ""))
    date_match = re.search(r"(\d{2}[-/]\d{2}[-/]\d{4})", text)
    if not amt_match:
        return None

    amt = Decimal(amt_match.group(1).replace(",", ""))
    txn_date = date.today()
    if date_match:
        try:
            from datetime import datetime

            txn_date = datetime.strptime(date_match.group(1), "%d-%m-%Y").date()
        except Exception:
            pass

    return {
        "account_id": account_id,
        "txn_date": txn_date,
        "description_raw": text,
        "amount": amt,
        "currency": "INR",
        "source_type": "sms",
    }
