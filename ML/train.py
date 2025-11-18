#!/usr/bin/env python3
"""
Train script that can produce two models:

- Multiclass category model (trained on text)
- Binary fraud model (trained on text + optional numeric features)

Usage (from repo root):
    python -m ML.train --data-path ML/data/example_multi.csv --text-col text \
            --category-col category --fraud-col fraud --amount-col amount --output-dir ML

Saves model artifacts under `<output-dir>/models/` and logs under `<output-dir>/logs/`.
"""
import argparse
import json
import os
from datetime import datetime
import warnings

import joblib
import numpy as np
import pandas as pd
from sklearn.exceptions import NotFittedError
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, FunctionTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.base import BaseEstimator, TransformerMixin
import numpy as _np


# Removed TfidfTransformerWrapper: pipeline now owns its own TF-IDF transformer

# Attempt relative import (works when run as module); fallback to package import when running as script
try:
    from .data_preprocessing import (
        load_data,
        clean_text,
        augment_data,
        vectorize_texts,
        balance_smote,
        dataset_hash,
    )
except Exception:
    from ML.data_preprocessing import (
        load_data,
        clean_text,
        augment_data,
        vectorize_texts,
        balance_smote,
        dataset_hash,
    )

RANDOM_STATE_DEFAULT = 42


def column_to_1d(X):
    """Convert a single-column 2D array-like to a 1D array. Top-level so it is picklable."""
    arr = _np.asarray(X)
    if arr.ndim == 2 and arr.shape[1] == 1:
        return arr.ravel()
    return arr


def safe_train_test_split(X, y, test_size, stratify_col, random_state):
    """Wrapper around train_test_split that falls back to non-stratified split if stratify fails."""
    try:
        return train_test_split(X, y, test_size=test_size, stratify=stratify_col, random_state=random_state)
    except ValueError:
        warnings.warn("Stratified split failed (likely too few samples per class). Falling back to non-stratified split.")
        return train_test_split(X, y, test_size=test_size, random_state=random_state)


def split_701515(texts, labels, random_state=RANDOM_STATE_DEFAULT):
    """Split into 70% train, 15% val, 15% test. Handles small datasets gracefully."""
    # First split: train (70%) and temp (30%)
    X_train, X_temp, y_train, y_temp = safe_train_test_split(
        texts, labels, test_size=0.30, stratify_col=labels, random_state=random_state
    )
    # Second split: val/test 50/50 of temp -> each 15% overall
    X_val, X_test, y_val, y_test = safe_train_test_split(
        X_temp, y_temp, test_size=0.50, stratify_col=y_temp, random_state=random_state
    )
    return X_train, X_val, X_test, y_train, y_val, y_test


def fit_vectorizer_and_model(X_train_texts, y_train, max_features=50000, ngram_range=(1, 2), random_state=RANDOM_STATE_DEFAULT, smote=False):
    vec, X_train = vectorize_texts(X_train_texts, max_features=max_features, ngram_range=ngram_range)

    # Optionally apply SMOTE (be aware: converts to dense)
    if smote:
        X_train_res, y_train_res = balance_smote(X_train, np.array(y_train), random_state=random_state)
    else:
        # keep original shapes
        y_train_res = np.array(y_train)
        X_train_res = X_train

    clf = LogisticRegression(solver="saga", max_iter=2000, random_state=random_state)
    # If X_train_res is dense/numpy array, scikit-learn accepts it; sparse acceptable too.
    clf.fit(X_train_res, y_train_res)
    return vec, clf


def fit_category_model(tfidf, X_texts, y_cat):
    X = tfidf.transform(X_texts)
    clf = LogisticRegression(multi_class='multinomial', solver='saga', max_iter=2000, random_state=RANDOM_STATE_DEFAULT)
    clf.fit(X, y_cat)
    return clf


def fit_fraud_pipeline(tfidf, df, text_col='text_clean', amount_col=None):
    # Build a preprocessor that creates its own TF-IDF inside the pipeline so
    # it is fit as part of `pipe.fit(...)`. This avoids cloning a pre-fitted
    # vectorizer which can become unfitted when sklearn clones estimators.
    # Text transformer pipeline: convert column to 1d then vectorize
    text_pipeline = Pipeline([
        ("col", FunctionTransformer(column_to_1d, validate=False)),
        (
            "tfidf",
            TfidfVectorizer(ngram_range=(1, 2), max_features=50000),
        ),
    ])

    transformers = [("text", text_pipeline, [text_col])]
    if amount_col and amount_col in df.columns:
        transformers.append(("num", StandardScaler(), [amount_col]))

    preprocessor = ColumnTransformer(transformers=transformers, remainder="drop")

    fraud_clf = LogisticRegression(solver="saga", max_iter=2000, class_weight="balanced", random_state=RANDOM_STATE_DEFAULT)
    pipe = Pipeline([("pre", preprocessor), ("clf", fraud_clf)])

    X_input = df[[text_col] + ([amount_col] if amount_col and amount_col in df.columns else [])]
    pipe.fit(X_input, df['fraud'])
    return pipe


def split_df_701515(df, label_col, random_state=RANDOM_STATE_DEFAULT):
    """Split a dataframe into train/val/test (70/15/15) stratified by label_col when possible."""
    # First split: train (70%) and temp (30%)
    train_df, temp_df, y_train, y_temp = safe_train_test_split(
        df, df[label_col], test_size=0.30, stratify_col=df[label_col], random_state=random_state
    )
    # Second split: val/test 50/50 of temp -> each 15% overall
    val_df, test_df, y_val, y_test = safe_train_test_split(
        temp_df, temp_df[label_col], test_size=0.50, stratify_col=temp_df[label_col], random_state=random_state
    )
    return train_df, val_df, test_df


def compute_metrics_pipeline(pipe, X_df, y_true, text_col='text_clean'):
    """Compute metrics for a fitted pipeline that accepts a DataFrame X_df."""
    if len(X_df) == 0:
        return {"error": "empty_set"}

    try:
        y_prob = pipe.predict_proba(X_df)
        y_conf = _np.max(y_prob, axis=1)
    except Exception:
        y_conf = None

    y_pred = pipe.predict(X_df)

    unique_labels = list(set(y_true))
    if len(unique_labels) == 2 and set(unique_labels).issubset({0, 1}):
        average = 'binary'
    else:
        average = 'macro'

    metrics = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, average=average, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, average=average, zero_division=0)),
        "f1": float(f1_score(y_true, y_pred, average=average, zero_division=0)),
        "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(),
        "average": average,
    }
    if y_conf is not None:
        metrics.update(
            {
                "confidence_mean": float(y_conf.mean()),
                "confidence_std": float(y_conf.std()),
                "pct_below_0.6": float((y_conf < 0.6).mean()),
            }
        )
    return metrics


def compute_metrics(clf, vec, texts, y_true):
    """Return metrics dict. clf assumes already fitted. vec is the fitted vectorizer."""
    if len(texts) == 0:
        return {"error": "empty_set"}

    X = vec.transform(texts)
    try:
        y_prob = clf.predict_proba(X)
        y_conf = np.max(y_prob, axis=1).tolist()
    except Exception:
        y_conf = None

    y_pred = clf.predict(X)
    # Choose averaging strategy: use 'binary' only when labels are binary numeric (0/1)
    unique_labels = list(set(y_true))
    if len(unique_labels) == 2 and set(unique_labels).issubset({0, 1}):
        average = 'binary'
    else:
        average = 'macro'

    metrics = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, average=average, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, average=average, zero_division=0)),
        "f1": float(f1_score(y_true, y_pred, average=average, zero_division=0)),
        "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(),
        "average": average,
    }
    if y_conf is not None:
        y_conf = np.array(y_conf)
        metrics.update(
            {
                "confidence_mean": float(y_conf.mean()),
                "confidence_std": float(y_conf.std()),
                "pct_below_0.6": float((y_conf < 0.6).mean()),
            }
        )
    return metrics


def save_artifacts(vec, clf, output_dir):
    models_dir = os.path.join(output_dir, "models")
    os.makedirs(models_dir, exist_ok=True)
    vec_path = os.path.join(models_dir, "vectorizer.pkl")
    model_path = os.path.join(models_dir, "model.pkl")
    pipeline_path = os.path.join(models_dir, "pipeline.pkl")

    joblib.dump(vec, vec_path)
    joblib.dump(clf, model_path)
    joblib.dump({"vectorizer": vec, "model": clf}, pipeline_path)

    return {"vectorizer": vec_path, "model": model_path, "pipeline": pipeline_path}


def main():
    p = argparse.ArgumentParser(description="Train TF-IDF + LogisticRegression classifier")
    p.add_argument("--data-path", required=True, help="Path to CSV/JSON dataset")
    p.add_argument("--text-col", default="text", help="Column name for text")
    p.add_argument("--label-col", default="label", help="Column name for binary label (0/1)")
    p.add_argument("--category-col", default=None, help="Column name for multiclass category labels")
    p.add_argument("--fraud-col", default=None, help="Column name for binary fraud labels (0/1)")
    p.add_argument("--amount-col", default=None, help="Optional numeric amount column name to include in fraud model")
    p.add_argument("--output-dir", default="ML", help="Output directory (models/logs/artifacts)")
    p.add_argument("--augment", type=int, default=0, help="Number of augmentations per row (0 disables)")
    p.add_argument("--smote", action="store_true", help="Apply SMOTE to training data")
    p.add_argument("--max-features", type=int, default=50000, help="TF-IDF max_features")
    p.add_argument("--ngram-min", type=int, default=1, help="TF-IDF ngram min")
    p.add_argument("--ngram-max", type=int, default=2, help="TF-IDF ngram max")
    p.add_argument("--random-state", type=int, default=RANDOM_STATE_DEFAULT, help="Random seed for reproducibility")
    args = p.parse_args()

    # Create dirs
    os.makedirs(os.path.join(args.output_dir, "models"), exist_ok=True)
    os.makedirs(os.path.join(args.output_dir, "logs"), exist_ok=True)
    os.makedirs(os.path.join(args.output_dir, "artifacts", "shap"), exist_ok=True)

    # Load data
    df = load_data(args.data_path)
    # Validate required columns
    if args.text_col not in df.columns:
        raise ValueError(f"Text column {args.text_col} must exist in the dataset")
    # Determine training mode
    has_category = args.category_col in df.columns if args.category_col else False
    has_fraud = args.fraud_col in df.columns if args.fraud_col else False
    has_label = args.label_col in df.columns if args.label_col else False
    if not any([has_category, has_fraud, has_label]):
        raise ValueError("Dataset must contain at least one of: label, category, or fraud columns")

    # Basic cleaning
    df["text_clean"] = df[args.text_col].fillna("").astype(str).apply(lambda t: clean_text(t))

    # Optional augmentation
    if args.augment and args.augment > 0:
        df = augment_data(df, text_col="text_clean", label_col=args.label_col, n_augments=args.augment, methods=["typo"])

    texts = df["text_clean"].tolist()

    saved_paths = {}
    run_results = {}

    # If category and/or fraud columns provided, train respective models
    if has_category or has_fraud:
        # Fit TF-IDF on all texts
        tfidf = TfidfVectorizer(ngram_range=(args.ngram_min, args.ngram_max), max_features=args.max_features)
        tfidf.fit(texts)
        # Save tfidf now (will be overwritten by save_artifacts later)
        # Category model
        if has_category:
            cat_texts = df['text_clean'].tolist()
            cat_labels = df[args.category_col].tolist()
            # split
            X_train_texts, X_val_texts, X_test_texts, y_train_cat, y_val_cat, y_test_cat = split_701515(cat_texts, cat_labels, random_state=args.random_state)
            cat_clf = fit_category_model(tfidf, X_train_texts, y_train_cat)
            # save
            models_dir = os.path.join(args.output_dir, 'models')
            os.makedirs(models_dir, exist_ok=True)
            joblib.dump(tfidf, os.path.join(models_dir, 'vectorizer.pkl'))
            joblib.dump(cat_clf, os.path.join(models_dir, 'cat_model.pkl'))
            saved_paths['vectorizer'] = os.path.join(models_dir, 'vectorizer.pkl')
            saved_paths['cat_model'] = os.path.join(models_dir, 'cat_model.pkl')
            # evaluate
            val_metrics_cat = compute_metrics(cat_clf, tfidf, X_val_texts, y_val_cat)
            test_metrics_cat = compute_metrics(cat_clf, tfidf, X_test_texts, y_test_cat)
            run_results['category'] = {'val': val_metrics_cat, 'test': test_metrics_cat}

        # Fraud model
        if has_fraud:
            # Ensure fraud column is named 'fraud' in df for fit_fraud_pipeline
            if args.fraud_col != 'fraud':
                df = df.rename(columns={args.fraud_col: 'fraud'})
            fraud_pipe = fit_fraud_pipeline(tfidf, df, text_col='text_clean', amount_col=args.amount_col)
            models_dir = os.path.join(args.output_dir, 'models')
            os.makedirs(models_dir, exist_ok=True)
            joblib.dump(fraud_pipe, os.path.join(models_dir, 'fraud_pipeline.pkl'))
            saved_paths['fraud_pipeline'] = os.path.join(models_dir, 'fraud_pipeline.pkl')
            # Evaluate fraud pipeline using dataframe splits (so the pipeline can accept the same input shape)
            cols = ['text_clean'] + ([args.amount_col] if args.amount_col and args.amount_col in df.columns else []) + ['fraud']
            temp_df = df[cols].copy()
            train_df_f, val_df_f, test_df_f = split_df_701515(temp_df, 'fraud', random_state=args.random_state)
            X_val_input = val_df_f[[c for c in cols if c != 'fraud']]
            X_test_input = test_df_f[[c for c in cols if c != 'fraud']]
            y_val_f = val_df_f['fraud'].tolist()
            y_test_f = test_df_f['fraud'].tolist()

            val_metrics_f = compute_metrics_pipeline(fraud_pipe, X_val_input, y_val_f)
            test_metrics_f = compute_metrics_pipeline(fraud_pipe, X_test_input, y_test_f)
            run_results['fraud'] = {'val': val_metrics_f, 'test': test_metrics_f}

    else:
        # fallback to single-label training using args.label_col
        labels = df[args.label_col].tolist()
        X_train_texts, X_val_texts, X_test_texts, y_train, y_val, y_test = split_701515(texts, labels, random_state=args.random_state)
        vec, clf = fit_vectorizer_and_model(
            X_train_texts,
            y_train,
            max_features=args.max_features,
            ngram_range=(args.ngram_min, args.ngram_max),
            random_state=args.random_state,
            smote=args.smote,
        )
        saved_paths = save_artifacts(vec, clf, args.output_dir)
        val_metrics = compute_metrics(clf, vec, X_val_texts, y_val)
        test_metrics = compute_metrics(clf, vec, X_test_texts, y_test)
        run_results['single_label'] = {'val': val_metrics, 'test': test_metrics}

    # Save metrics and run metadata
    run_meta = {
        "run_id": datetime.utcnow().isoformat() + "Z",
        "random_state": args.random_state,
        "data_path": args.data_path,
        "saved_paths": saved_paths,
        "results": run_results,
    }
    meta_path = os.path.join(args.output_dir, "logs", "run_metadata.json")
    with open(meta_path, "w") as fh:
        json.dump(run_meta, fh, indent=2)

    # Also save metrics separately
    # Save run-specific metrics
    with open(os.path.join(args.output_dir, "logs", "run_results.json"), "w") as fh:
        json.dump(run_results, fh, indent=2)

    print("Training complete.")
    print("Saved artifacts:", saved_paths)
    print("Run results:")
    print(json.dumps(run_results, indent=2))


if __name__ == "__main__":
    main()