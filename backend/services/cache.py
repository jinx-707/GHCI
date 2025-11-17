from functools import lru_cache

@lru_cache(maxsize=1024)
def simple_text_cache(key: str):
    # Placeholder - in real use we'd cache vectorized forms etc.
    return None
