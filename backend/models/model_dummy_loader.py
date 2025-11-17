# Dummy model loader for local testing if Member 1 model files are not present.
import random

CATEGORIES = ['Dining','Shopping','Utilities','Fuel','Education','Groceries','Rent','Entertainment']

def dummy_predict(text: str):
    # very naive rules
    t = (text or '').lower()
    if 'starbuck' in t or 'cafe' in t or 'coffee' in t:
        return 'Dining', random.uniform(0.6,0.95)
    if 'amazon' in t or 'flipkart' in t or 'myntra' in t:
        return 'Shopping', random.uniform(0.6,0.95)
    if 'petrol' in t or 'fuel' in t:
        return 'Fuel', random.uniform(0.6,0.95)
    # fallback
    return random.choice(CATEGORIES), random.uniform(0.3,0.8)