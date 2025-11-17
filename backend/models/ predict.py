import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')
VECT_PATH = os.path.join(os.path.dirname(__file__), 'vectorizer.pkl')

class ModelPredictor:
def __init__(self):
self.model = None
self.vectorizer = None
self._load()

def _load(self):
# Attempt to load real model, otherwise raise helpful error
try:
if os.path.exists(MODEL_PATH) and os.path.exists(VECT_PATH):
self.model = joblib.load(MODEL_PATH)
self.vectorizer = joblib.load(VECT_PATH)
else:
# Do not fail hard; user can use dummy loader in dev
self.model = None
self.vectorizer = None
except Exception as e:
# fall back to None — callers should handle
self.model = None
self.vectorizer = None

def predict(self, text: str) -> Tuple[str, float]:
text = (text or '')
if self.model is None or self.vectorizer is None:
raise RuntimeError('Model files not available. Place model.pkl and vectorizer.pkl in models/')
X = self.vectorizer.transform([text])
probs = self.model.predict_proba(X)[0]
idx = probs.argmax()
label = self.model.classes_[idx]
return str(label), float(probs[idx])

def batch_predict(self, texts: List[str]):
if self.model is None or self.vectorizer is None:
raise RuntimeError('Model files not available.')
X = self.vectorizer.transform(texts)
probs = self.model.predict_proba(X)
labels = self.model.classes_[probs.argmax(axis=1)]
confidences = probs.max(axis=1)
return list(zip(labels.tolist(), confidences.tolist()))