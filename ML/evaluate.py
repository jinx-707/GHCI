#!/usr/bin/env python3
"""Evaluate trained model, compute metrics, optional fairness, and generate SHAP plots.

Usage (from repo root):
  python -m ML.evaluate --model-path ML/models/model.pkl --vectorizer-path ML/models/vectorizer.pkl --test-csv ML/data/example_small.csv --text-col text --label-col label --output-dir ML
"""
import argparse
import json
import os
import random
import warnings
from datetime import datetime

import joblib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

try:
    from .data_preprocessing import clean_text
except Exception:
    from ML.data_preprocessing import clean_text

import shap


def load_model_and_vectorizer(model_path: str, vectorizer_path: str):
    model = joblib.load(model_path)
    vec = joblib.load(vectorizer_path)
    return model, vec


def perturb_text(text: str, n_swaps: int = 1, rng: random.Random = None) -> str:
    if rng is None:
        rng = random.Random()
    s = list(text)
    if len(s) < 2:
        return text
    for _ in range(n_swaps):
        i = rng.randrange(len(s))
        j = rng.randrange(len(s))
        s[i], s[j] = s[j], s[i]
    return ''.join(s)


def compute_standard_metrics(model, vec, texts, y_true):
    X = vec.transform(texts)
    try:
        y_prob = model.predict_proba(X)
        y_conf = np.max(y_prob, axis=1)
    except Exception:
        y_conf = None
    y_pred = model.predict(X)
    # Choose averaging: binary only for numeric 0/1, otherwise macro for multiclass
    unique_labels = list(set(y_true))
    if len(unique_labels) == 2 and set(unique_labels).issubset({0, 1}):
        average = 'binary'
    else:
        average = 'macro'

    metrics = {
        'accuracy': float(accuracy_score(y_true, y_pred)),
        'precision': float(precision_score(y_true, y_pred, average=average, zero_division=0)),
        'recall': float(recall_score(y_true, y_pred, average=average, zero_division=0)),
        'f1': float(f1_score(y_true, y_pred, average=average, zero_division=0)),
        'confusion_matrix': confusion_matrix(y_true, y_pred).tolist(),
        'average': average,
    }
    if y_conf is not None:
        metrics['confidence_mean'] = float(np.mean(y_conf))
        metrics['confidence_std'] = float(np.std(y_conf))
        metrics['pct_below_0.6'] = float(np.mean((y_conf < 0.6).astype(float)))
    return metrics, y_pred


def compute_consistency(model, vec, texts, n_perturbs=5, seed=42):
    rng = random.Random(seed)
    changes = []
    base_preds = model.predict(vec.transform(texts))
    for i, t in enumerate(texts):
        preds = []
        for _ in range(n_perturbs):
            pert = perturb_text(t, n_swaps=1, rng=rng)
            p = model.predict(vec.transform([pert]))[0]
            preds.append(p)
        # fraction of perturbed preds different from original
        diff = np.mean([1.0 if p != base_preds[i] else 0.0 for p in preds])
        changes.append(diff)
    return float(np.mean(changes))


def generate_shap(model, vec, texts, output_path: str, sample_size: int = 200):
    # Limit sample size for SHAP
    sample_texts = texts if len(texts) <= sample_size else random.sample(texts, sample_size)
    X = vec.transform(sample_texts)
    # Convert small sample to dense for SHAP explainer
    try:
        X_dense = X.toarray()
    except Exception:
        X_dense = np.asarray(X)

    # For linear models use LinearExplainer for speed
    try:
        explainer = shap.LinearExplainer(model, X_dense, feature_dependence="independent")
        shap_values = explainer.shap_values(X_dense)
    except Exception:
        # fallback to KernelExplainer (slower)
        def f(x):
            return model.predict_proba(x)
        explainer = shap.KernelExplainer(f, X_dense[:50])
        shap_values = explainer.shap_values(X_dense[:50], nsamples=100)

    feature_names = vec.get_feature_names_out() if hasattr(vec, 'get_feature_names_out') else None
    plt.figure(figsize=(8, 6))
    try:
        shap.summary_plot(shap_values, features=X_dense, feature_names=feature_names, show=False)
        plt.tight_layout()
        plt.savefig(output_path, dpi=150)
        plt.close()
        return True
    except Exception as e:
        warnings.warn(f"SHAP plotting failed: {e}")
        return False


def compute_fairness(y_true, y_pred, protected_values):
    # protected_values: list/array matching y_true length containing group labels
    df = pd.DataFrame({'y_true': y_true, 'y_pred': y_pred, 'group': protected_values})
    groups = df['group'].dropna().unique().tolist()
    results = {}
    for g in groups:
        sub = df[df['group'] == g]
        p_pos = float((sub['y_pred'] == 1).mean())
        tp = int(((sub['y_pred'] == 1) & (sub['y_true'] == 1)).sum())
        fn = int(((sub['y_pred'] == 0) & (sub['y_true'] == 1)).sum())
        fp = int(((sub['y_pred'] == 1) & (sub['y_true'] == 0)).sum())
        tn = int(((sub['y_pred'] == 0) & (sub['y_true'] == 0)).sum())
        tpr = float(tp / (tp + fn)) if (tp + fn) > 0 else 0.0
        fpr = float(fp / (fp + tn)) if (fp + tn) > 0 else 0.0
        results[g] = {'p_pos': p_pos, 'tpr': tpr, 'fpr': fpr}
    # compute pairwise diffs (max absolute differences)
    diffs = {}
    if len(groups) >= 2:
        for i in range(len(groups)):
            for j in range(i + 1, len(groups)):
                a, b = groups[i], groups[j]
                diffs[f'DP_{a}_vs_{b}'] = abs(results[a]['p_pos'] - results[b]['p_pos'])
                diffs[f'EO_tpr_{a}_vs_{b}'] = abs(results[a]['tpr'] - results[b]['tpr'])
                diffs[f'EO_fpr_{a}_vs_{b}'] = abs(results[a]['fpr'] - results[b]['fpr'])
    return results, diffs


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--model-path", required=True)
    p.add_argument("--vectorizer-path", required=True)
    p.add_argument("--test-csv", required=True)
    p.add_argument("--text-col", default="text")
    p.add_argument("--label-col", default="label")
    p.add_argument("--protected-col", default=None)
    p.add_argument("--output-dir", default="ML")
    p.add_argument("--shap-out", default=None)
    p.add_argument("--consistency-perturbs", type=int, default=5)
    args = p.parse_args()

    os.makedirs(os.path.join(args.output_dir, 'logs'), exist_ok=True)
    os.makedirs(os.path.join(args.output_dir, 'artifacts', 'shap'), exist_ok=True)

    model, vec = load_model_and_vectorizer(args.model_path, args.vectorizer_path)

    df = pd.read_csv(args.test_csv)
    if args.text_col not in df.columns or args.label_col not in df.columns:
        raise ValueError("test csv must contain text and label columns")
    texts = df[args.text_col].fillna("").astype(str).apply(clean_text).tolist()
    y_true = df[args.label_col].tolist()

    metrics, y_pred = compute_standard_metrics(model, vec, texts, y_true)

    # consistency
    metrics['consistency'] = compute_consistency(model, vec, texts, n_perturbs=args.consistency_perturbs)

    # fairness if requested and column exists
    fairness = {}
    if args.protected_col and args.protected_col in df.columns:
        protected = df[args.protected_col].tolist()
        group_stats, diffs = compute_fairness(y_true, y_pred, protected)
        fairness['group_stats'] = group_stats
        fairness['diffs'] = diffs
        metrics['fairness'] = fairness

    # SHAP
    shap_out = args.shap_out or os.path.join(args.output_dir, 'artifacts', 'shap', 'summary.png')
    ok = generate_shap(model, vec, texts, shap_out)
    metrics['shap_saved'] = bool(ok)
    metrics['shap_path'] = shap_out if ok else None

    # Save metrics
    run_meta = {
        'run_id': datetime.utcnow().isoformat() + 'Z',
        'model_path': args.model_path,
        'vectorizer_path': args.vectorizer_path,
        'test_csv': args.test_csv,
        'metrics': metrics,
    }
    out_path = os.path.join(args.output_dir, 'logs', 'metrics_evaluation.json')
    with open(out_path, 'w') as fh:
        json.dump(run_meta, fh, indent=2)

    print('Evaluation complete. Metrics saved to', out_path)


if __name__ == '__main__':
    main()
