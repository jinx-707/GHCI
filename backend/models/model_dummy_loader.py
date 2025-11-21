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

def dummy_predict_enhanced(text: str, amount: float = None):
    """Enhanced dummy predictor that returns full prediction object"""
    category, confidence = dummy_predict(text)
    
    # ML-like fraud risk calculation
    fraud_prob = random.uniform(0.05, 0.95)  # Random but realistic range
    
    # Adjust based on patterns
    if 'coffee' in text.lower() or 'starbucks' in text.lower():
        fraud_prob = random.uniform(0.02, 0.15)  # Coffee is usually safe
    elif 'suspicious' in text.lower() or 'unknown' in text.lower():
        fraud_prob = random.uniform(0.65, 0.92)  # Suspicious keywords
    elif amount and amount > 100000:
        fraud_prob = random.uniform(0.25, 0.55)  # High amounts more risky
    elif 'amazon' in text.lower() or 'shopping' in text.lower():
        fraud_prob = random.uniform(0.08, 0.25)  # Shopping moderate risk
    
    # Determine risk level
    if fraud_prob > 0.7:
        fraud_risk = 'HIGH'
    elif fraud_prob > 0.3:
        fraud_risk = 'MEDIUM'
    else:
        fraud_risk = 'LOW'
    
    return {
        'category': category,
        'category_confidence': confidence,
        'confidence': confidence,
        'fraud_probability': fraud_prob,
        'fraud_risk_level': fraud_risk,
        'is_fraud': fraud_prob > 0.5,
        'amount': amount,
        'amount_formatted': f"₹{amount:,.0f}" if amount else None,
        'model_version': 'enhanced',
        'text': text
    }