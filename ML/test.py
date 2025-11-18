import os
import sys
import joblib

# Ensure repo root is on sys.path so `import ML` works when running script directly
repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if repo_root not in sys.path:
	sys.path.insert(0, repo_root)

try:
	from ML.data_preprocessing import clean_text
except Exception:
	# Fallback: try importing the module directly from the ML folder
	sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
	from data_preprocessing import clean_text

pipeline = joblib.load(os.path.join(repo_root, "ML", "models", "pipeline.pkl"))
vec = pipeline["vectorizer"]
clf = pipeline["model"]

text = "Got a bonus today"
text_clean = clean_text(text)
X = vec.transform([text_clean])
pred = clf.predict(X)[0]
prob = clf.predict_proba(X)[0][1]  # probability of positive class (label 1)
print("pred:", pred, "prob_positive:", prob)