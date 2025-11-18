#!/usr/bin/env python3
"""Runtime prediction helper that returns a JSON prediction object.

Usage examples (from repo root):
  python -m ML.predict --text "Debit of 450.00 at Starbucks Coffee" --amount 450
  python -c "from ML.predict import predict_single; print(predict_single('Paid rent', amount=1200))"
"""
import os
import sys
import json
from datetime import datetime
import joblib
import numpy as np

try:
    from .data_preprocessing import clean_text
except Exception:
    from ML.data_preprocessing import clean_text

try:
    import shap
except Exception:
    shap = None


def column_to_1d(X):
    """Compatibility shim used by older pickled pipelines: convert single-column 2D inputs to 1D."""
    arr = np.asarray(X)
    if getattr(arr, 'ndim', 0) == 2 and arr.shape[1] == 1:
        return arr.ravel()
    return arr


def _explain_linear(model, vec, text_clean, top_k=5):
    X = vec.transform([text_clean])
    try:
        x_vals = X.toarray().ravel()
    except Exception:
        x_vals = np.asarray(X).ravel()
    if getattr(model, 'coef_', None) is None:
        return []
    coefs = model.coef_
    # multiclass: pick predicted class
    if coefs.ndim == 2:
        probs = model.predict_proba(X)[0]
        cls_idx = int(np.argmax(probs))
        coef_vec = coefs[cls_idx]
    else:
        coef_vec = coefs.ravel()
    contribs = coef_vec * x_vals
    if not hasattr(vec, 'get_feature_names_out'):
        names = [f'f{i}' for i in range(len(contribs))]
    else:
        names = vec.get_feature_names_out()
    idx = np.argsort(-np.abs(contribs))[:top_k]
    features = []
    for i in idx:
        if x_vals[i] != 0:
            features.append({'feature': str(names[i]), 'contribution': float(contribs[i])})
    return features


def predict_single(text_raw, amount=None, model_dir='ML/models', top_k=5, model_version=None):
    # load artifacts
    vec_path = os.path.join(model_dir, 'vectorizer.pkl')
    cat_path = os.path.join(model_dir, 'cat_model.pkl')
    fraud_path = os.path.join(model_dir, 'fraud_pipeline.pkl')

    if not os.path.exists(vec_path):
        raise FileNotFoundError(f"Vectorizer not found at {vec_path}")
    vec = joblib.load(vec_path)

    cat_model = joblib.load(cat_path) if os.path.exists(cat_path) else None
    fraud_pipe = joblib.load(fraud_path) if os.path.exists(fraud_path) else None

    text_clean = clean_text(text_raw)

    out = {
        'input_text': text_raw,
        'text_clean': text_clean,
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'model_version': model_version,
    }

    # Category prediction
    if cat_model is not None:
        X_vec = vec.transform([text_clean])
        probs = cat_model.predict_proba(X_vec)[0]
        idx = int(np.argmax(probs))
        out['predicted_category'] = str(cat_model.classes_[idx])
        out['category_confidence'] = float(probs[idx])
        out['xai'] = {'category_top_features': _explain_linear(cat_model, vec, text_clean, top_k=top_k)}
    else:
        out['predicted_category'] = None
        out['category_confidence'] = None
        out['xai'] = {'category_top_features': []}

    # Fraud prediction
    if fraud_pipe is not None:
        # fraud_pipe expects a DataFrame-like with columns used during training
        import pandas as pd
        df_in = pd.DataFrame({'text_clean': [text_clean]})
        if amount is not None:
            df_in['amount'] = [float(amount)]
        else:
            # if pipeline expects amount column and it's missing, fill with 0
            try:
                df_in['amount'] = [0.0]
            except Exception:
                pass
        fraud_pred = int(fraud_pipe.predict(df_in)[0])
        fraud_prob = float(fraud_pipe.predict_proba(df_in)[0][1])
        out['predicted_fraud'] = fraud_pred
        out['fraud_confidence'] = fraud_prob
        # explain fraud via SHAP if available
        if shap is not None:
            try:
                explainer = shap.Explainer(fraud_pipe, df_in)
                vals = explainer(df_in)
                contribs = []
                fmap = vals.feature_names
                fvals = vals.values[0]
                idxs = np.argsort(-np.abs(fvals))[:top_k]
                for i in idxs:
                    contribs.append({'feature': str(fmap[i]), 'contribution': float(fvals[i])})
                out['xai']['fraud_top_features'] = contribs
            except Exception:
                out['xai']['fraud_top_features'] = []
        else:
            out['xai']['fraud_top_features'] = []
    else:
        out['predicted_fraud'] = None
        out['fraud_confidence'] = None
        out['xai']['fraud_top_features'] = []

    # Append to predictions log
    try:
        os.makedirs(os.path.join('ML', 'logs'), exist_ok=True)
        with open(os.path.join('ML', 'logs', 'predictions.jsonl'), 'a') as fh:
            fh.write(json.dumps(out) + '\n')
    except Exception:
        pass
    return out


if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--text', required=True)
    p.add_argument('--amount', type=float, default=None)
    p.add_argument('--model-dir', default='ML/models')
    p.add_argument('--top-k', type=int, default=5)
    args = p.parse_args()
    print(json.dumps(predict_single(args.text, amount=args.amount, model_dir=args.model_dir, top_k=args.top_k), indent=2))
