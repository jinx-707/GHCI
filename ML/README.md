# ML folder — Model training & inference

This folder contains scripts and utilities for training, evaluating and running the simple TF‑IDF + Logistic Regression models used by the project.

Contents
- `train.py` — training entrypoint. Trains a multiclass category model and an optional fraud pipeline (text + numeric features). Saves artifacts to `ML/models/` and logs to `ML/logs/`.
- `evaluate.py` — evaluation and explainability. Loads artifacts and produces metrics + SHAP plots under `ML/artifacts/shap/` and `ML/logs/`.
- `predict.py` — runtime prediction helper (CLI + Python API). Produces JSON prediction objects and appends to `ML/logs/predictions.jsonl`.
- `augment_dataset.py` — generates additional synthetic rows using `augment_data` from `data_preprocessing.py` and writes `ML/data/extended_multi.csv`.
- `data_preprocessing.py` — cleaning, tokenization, augmentation, TF‑IDF helpers, and SMOTE balancing.
- `models/` — saved model artifacts created by `train.py` (e.g. `vectorizer.pkl`, `cat_model.pkl`, `fraud_pipeline.pkl`).
- `logs/` — run metadata and metrics (`run_metadata.json`, `run_results.json`, `predictions.jsonl`).

Quick overview
- Data is expected as CSV with at minimum a text column (default `text`). The training pipeline creates a `text_clean` column via `clean_text()`.
- Text features use `TfidfVectorizer` (word n‑grams by default). Models are `LogisticRegression` (multiclass for category; binary for fraud inside a pipeline that handles numeric fields).
- Train/val/test split uses 70/15/15 with stratification when possible.

Quick start

1) Train on a dataset

```bash
python -m ML.train \
  --data-path ML/data/extended_multi.csv \
  --text-col text \
  --category-col category \
  --fraud-col fraud \
  --amount-col amount \
  --output-dir ML \
  --smote
```

Artifacts will be written to `ML/models/` and logs to `ML/logs/`.

2) Predict (single-line)

```bash
python -m ML.predict --text "I need to save money this month" --amount 0 --model-dir ML/models
```

3) Augment the dataset

```bash
python -m ML.augment_dataset --input ML/data/example_multi.csv --output ML/data/extended_multi.csv --n-augments 2
```

4) Evaluate and create SHAP plots

```bash
python -m ML.evaluate \
  --model-path ML/models/cat_model.pkl \
  --vectorizer ML/models/vectorizer.pkl \
  --data-path ML/data/extended_multi.csv \
  --text-col text --label-col category --output-dir ML
```

Troubleshooting & notes
- Reproducibility: the training split and stochastic operations use `--random-state` (default 42). If you want different runs, pass a different seed or use a time-based seed.
- Overfitting / identical confidences: if repeated retrains return near-identical probabilities, you likely have duplicated/augmented rows or highly separable data. Consider deduplication (`pandas.drop_duplicates`) or probabilty calibration (wrap classifiers with `CalibratedClassifierCV`).
- Pickling / deployment: pipelines include a `FunctionTransformer` that relies on a module-level `column_to_1d` helper — keep these functions at top-level so joblib pickle/unpickle works.
- Large datasets: SMOTE converts sparse TF‑IDF matrices to dense arrays — this can use a lot of memory. Consider sampling or avoiding SMOTE on large TF‑IDF matrices.

Recommended next steps
- Keep a curated, unseen `ML/data/holdout.csv` for final evaluation (never used in training/augmentation).
- Add `--calibrate` to `train.py` to produce calibrated probabilities when you need reliable confidences.
- Consider paraphrase/back-translation augmentation for greater textual diversity instead of (or in addition to) typos.

Developer notes
- Python packages required (see `ML/requirements.txt`): `pandas`, `numpy`, `scikit-learn`, `imblearn`, `joblib`, `shap`, `thefuzz`, `langdetect`, `nltk`, `matplotlib`.
- Project layout expects `ML/` to be a module (run scripts with `python -m ML.train`, etc.).

If you want, I can:
- add a `--calibrate` flag to `train.py`,
- create a `ML/batch_predict.py` to export CSV/JSONL predictions for a file, or
- add a script to dedupe `ML/data/extended_multi.csv` and retrain automatically.

---
Path: `ML/README.md`
