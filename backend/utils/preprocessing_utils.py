import re
from Levenshtein import distance as lev

def clean_text(s: str) -> str:
    if not s:
        return ''
    s = s.lower()
    s = re.sub(r"[^a-z0-9\s]", ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def fuzzy_match(a: str, b: str, max_dist: int = 2) -> bool:
    try:
        return lev(a.lower(), b.lower()) <= max_dist
    except Exception:
        return False
