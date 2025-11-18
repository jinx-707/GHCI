from __future__ import annotations

from typing import List

from integration.db.models import Transaction


def build_ml_payload(transactions: List[Transaction]) -> List[dict]:
    payload = []
    for t in transactions:
        text = "".join(
            [
                (t.description_clean or t.description_raw or ""),
                " ",
                str(t.amount),
                " ",
                (t.direction or ""),
            ]
        )
        payload.append({"transaction_id": t.transaction_id, "text": text})
    return payload
