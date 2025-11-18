import re
import unicodedata
import random
import hashlib
from typing import List, Tuple, Optional, Dict

import pandas as pd
import numpy as np
from thefuzz import process
from langdetect import detect
import nltk

from sklearn.feature_extraction.text import TfidfVectorizer
from imblearn.over_sampling import SMOTE

try:
    nltk.data.find("tokenizers/punkt")
except Exception:
    nltk.download("punkt")


def load_data(path: str, sep: str = ",") -> pd.DataFrame:
    """Load a dataset from CSV/TSV/JSON into a DataFrame.

    Supports CSV by default. If path ends with .json, uses pd.read_json.
    """
    if path.endswith(".json"):
        return pd.read_json(path)
    return pd.read_csv(path, sep=sep)


def clean_text(text: str, lower: bool = True) -> str:
    """Normalize and clean a single text string.

    - Unicode normalization
    - Remove URLs, HTML tags
    - Remove excessive punctuation
    - Normalize whitespace
    """
    if text is None:
        return ""
    if not isinstance(text, str):
        text = str(text)
    # Unicode normalization
    text = unicodedata.normalize("NFKC", text)
    # Remove URLs
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    # Remove HTML tags
    text = re.sub(r"<.*?>", " ", text)
    # Replace non-word characters (keep unicode letters, numbers, and basic punctuation)
    text = re.sub(r"[^\w\s\-'.,€£$%]", " ", text)
    # Collapse whitespace
    text = re.sub(r"\s+", " ", text).strip()
    if lower:
        text = text.lower()
    return text


def fuzzy_standardize(value: str, choices: List[str], threshold: int = 85) -> str:
    """Standardize a categorical value using fuzzy matching against provided choices.

    Returns the best match if score >= threshold, otherwise returns the original value.
    """
    if value is None:
        return value
    try:
        match, score = process.extractOne(str(value), choices)
        if score >= threshold:
            return match
    except Exception:
        pass
    return value


def tokenize_multilingual(text: str) -> List[str]:
    """Detect language then tokenize. Falls back to simple regex tokenization.

    Uses `langdetect` for language detection and `nltk.word_tokenize` where available.
    """
    if not text:
        return []
    text = clean_text(text, lower=False)
    try:
        lang = detect(text)
    except Exception:
        lang = "en"
    # For languages where punkt tokenizers exist, use nltk.word_tokenize
    try:
        toks = nltk.word_tokenize(text, language="english") if lang.startswith("en") else nltk.word_tokenize(text)
        toks = [t for t in toks if t.strip()]
        return toks
    except Exception:
        # Fallback simple tokenization
        return re.findall(r"\w+", text)


def _random_typo(text: str, n_swaps: int = 1, random_state: Optional[int] = None) -> str:
    if not text:
        return text
    rng = random.Random(random_state)
    chars = list(text)
    for _ in range(n_swaps):
        if len(chars) < 2:
            break
        i = rng.randrange(len(chars))
        j = rng.randrange(len(chars))
        chars[i], chars[j] = chars[j], chars[i]
    return "".join(chars)


def _synonym_swap(text: str, synonym_map: Dict[str, List[str]], random_state: Optional[int] = None) -> str:
    if not text:
        return text
    rng = random.Random(random_state)
    tokens = re.findall(r"\w+|[^\\w\s]", text)
    for i, tok in enumerate(tokens):
        key = tok.lower()
        if key in synonym_map and synonym_map[key]:
            tokens[i] = rng.choice(synonym_map[key])
    return " ".join(tokens)


def augment_data(
    df: pd.DataFrame,
    text_col: str = "text",
    label_col: str = "label",
    n_augments: int = 1,
    methods: List[str] = None,
    synonym_map: Dict[str, List[str]] = None,
    random_state: Optional[int] = None,
) -> pd.DataFrame:
    """Perform simple data augmentation on text column.

    Supported methods: 'typo', 'synonym'. Returns DataFrame with augmented rows appended.
    """
    if methods is None:
        methods = ["typo"]
    if synonym_map is None:
        synonym_map = {}
    rng = random.Random(random_state)
    aug_rows = []
    for _, row in df.iterrows():
        text = str(row.get(text_col, ""))
        label = row.get(label_col)
        for i in range(n_augments):
            method = rng.choice(methods)
            if method == "typo":
                aug_text = _random_typo(text, n_swaps=1, random_state=rng.randint(0, 2 ** 31 - 1))
            elif method == "synonym":
                aug_text = _synonym_swap(text, synonym_map, random_state=rng.randint(0, 2 ** 31 - 1))
            else:
                aug_text = text
            new_row = row.copy()
            new_row[text_col] = aug_text
            aug_rows.append(new_row)
    if aug_rows:
        aug_df = pd.DataFrame(aug_rows)
        return pd.concat([df, aug_df], ignore_index=True)
    return df


def vectorize_texts(texts: List[str], max_features: int = 50000, ngram_range: Tuple[int, int] = (1, 2)) -> Tuple[TfidfVectorizer, np.ndarray]:
    """Fit a TF-IDF vectorizer and transform texts.

    Returns the fitted vectorizer and the transformed matrix (CSR or dense depending on settings).
    """
    vec = TfidfVectorizer(ngram_range=ngram_range, max_features=max_features)
    X = vec.fit_transform(texts)
    return vec, X


def balance_smote(X, y, random_state: int = 42):
    """Apply SMOTE to balance classes. Accepts sparse or dense X. Returns X_res, y_res.

    Note: SMOTE operates on dense arrays; convert if needed.
    """
    # If sparse, convert to dense (note: for large matrices this is memory-heavy)
    try:
        if hasattr(X, "toarray"):
            X_dense = X.toarray()
        else:
            X_dense = np.asarray(X)
    except Exception:
        X_dense = np.asarray(X)
    sm = SMOTE(random_state=random_state)
    X_res, y_res = sm.fit_resample(X_dense, y)
    return X_res, y_res


def save_preprocessed(df: pd.DataFrame, path: str) -> None:
    """Save preprocessed DataFrame to CSV (overwrites)."""
    df.to_csv(path, index=False)


def dataset_hash(df: pd.DataFrame) -> str:
    """Compute a SHA256 hash of a DataFrame's CSV representation for reproducibility."""
    csv = df.to_csv(index=False).encode("utf-8")
    return hashlib.sha256(csv).hexdigest()


__all__ = [
    "load_data",
    "clean_text",
    "fuzzy_standardize",
    "tokenize_multilingual",
    "augment_data",
    "vectorize_texts",
    "balance_smote",
    "save_preprocessed",
    "dataset_hash",
]
