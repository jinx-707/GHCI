#!/usr/bin/env python3
"""Small utility to augment the existing multi-label dataset.

Reads `ML/data/example_multi.csv`, calls the project's `augment_data` helper,
and writes `ML/data/extended_multi.csv` (original kept as backup). This uses the
same augmentation methods implemented in `ML/data_preprocessing.py` (e.g.
typos). You can control `--n-augments` (per-row) and whether to shuffle/dedupe.

Usage:
  python -m ML.augment_dataset --input ML/data/example_multi.csv --n-augments 2

"""
import argparse
import os
import pandas as pd

try:
    from .data_preprocessing import augment_data
except Exception:
    from ML.data_preprocessing import augment_data


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input", default="ML/data/example_multi.csv", help="Input CSV path")
    p.add_argument("--output", default="ML/data/extended_multi.csv", help="Output CSV path")
    p.add_argument("--n-augments", type=int, default=2, help="Number of augmentations per row")
    p.add_argument("--methods", nargs="+", default=["typo"], help="Augmentation methods to use (see data_preprocessing)")
    p.add_argument("--dedupe", action="store_true", help="Drop duplicate texts after augmentation")
    args = p.parse_args()

    if not os.path.exists(args.input):
        raise FileNotFoundError(f"Input not found: {args.input}")

    df = pd.read_csv(args.input)
    # Ensure expected columns exist
    if 'text' not in df.columns and 'text_clean' not in df.columns:
        raise ValueError("Input CSV must contain a 'text' or 'text_clean' column")

    # If only raw 'text' exists, copy into 'text_clean' for augmentation helper
    if 'text_clean' not in df.columns:
        df['text_clean'] = df['text'].astype(str)

    print(f"Loaded {len(df)} rows from {args.input}")
    aug_df = augment_data(df, text_col='text_clean', label_col=None, n_augments=args.n_augments, methods=args.methods)

    # Merge original + augmented
    combined = pd.concat([df, aug_df], ignore_index=True)
    if args.dedupe:
        before = len(combined)
        combined = combined.drop_duplicates(subset=['text_clean'])
        print(f"Deduped {before - len(combined)} rows")

    combined.to_csv(args.output, index=False)
    print(f"Wrote {len(combined)} rows to {args.output}")


if __name__ == '__main__':
    main()
