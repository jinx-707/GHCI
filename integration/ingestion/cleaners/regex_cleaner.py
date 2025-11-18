from __future__ import annotations

import re


def regex_clean(text: str) -> str:
    if not text:
        return ""
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    s = re.sub(r"\s+", " ", s)
    return s
