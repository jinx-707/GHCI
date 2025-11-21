#!/usr/bin/env python3
"""
Quick fix for ML model compatibility issues
Retrains models with current numpy/scikit-learn versions
"""
import os
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
import joblib
import re

def clean_text(text):
    """Clean text for ML processing"""
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def create_sample_data():
    """Create sample training data"""
    data = [
        # Dining
        ("starbucks coffee purchase", "Dining"),
        ("cafe coffee day bill", "Dining"),
        ("restaurant payment", "Dining"),
        ("pizza hut order", "Dining"),
        ("mcdonalds meal", "Dining"),
        ("food delivery", "Dining"),
        
        # Shopping
        ("amazon purchase", "Shopping"),
        ("flipkart order", "Shopping"),
        ("myntra clothing", "Shopping"),
        ("shopping mall", "Shopping"),
        ("online shopping", "Shopping"),
        ("retail store", "Shopping"),
        
        # Transportation
        ("uber ride", "Transportation"),
        ("ola cab", "Transportation"),
        ("petrol pump", "Transportation"),
        ("fuel station", "Transportation"),
        ("bus ticket", "Transportation"),
        ("train booking", "Transportation"),
        
        # Entertainment
        ("netflix subscription", "Entertainment"),
        ("hotstar premium", "Entertainment"),
        ("movie ticket", "Entertainment"),
        ("spotify music", "Entertainment"),
        ("youtube premium", "Entertainment"),
        ("gaming subscription", "Entertainment"),
        
        # Utilities
        ("electricity bill", "Utilities"),
        ("water bill", "Utilities"),
        ("internet payment", "Utilities"),
        ("mobile recharge", "Utilities"),
        ("gas bill", "Utilities"),
        ("phone bill", "Utilities"),
        
        # Banking
        ("bank transfer", "Banking"),
        ("emi payment", "Banking"),
        ("loan payment", "Banking"),
        ("credit card", "Banking"),
        ("atm withdrawal", "Banking"),
        ("bank charges", "Banking"),
        
        # Groceries
        ("grocery store", "Groceries"),
        ("supermarket", "Groceries"),
        ("vegetables", "Groceries"),
        ("fruits", "Groceries"),
        ("big bazaar", "Groceries"),
        ("reliance fresh", "Groceries"),
        
        # Other/Suspicious
        ("unknown payment", "Other"),
        ("suspicious transaction", "Other"),
        ("unrecognized charge", "Other"),
        ("generic payment", "Other"),
        ("misc transaction", "Other"),
        ("other expense", "Other"),
    ]
    
    # Add more variations
    extended_data = []
    for text, category in data:
        extended_data.append((text, category))
        # Add variations
        extended_data.append((text + " transaction", category))
        extended_data.append((text.replace(" ", "_"), category))
    
    return extended_data

def create_fraud_data():
    """Create sample fraud training data"""
    data = []
    
    # Non-fraud examples (label = 0)
    non_fraud = [
        ("starbucks coffee", 450, 0),
        ("amazon shopping", 2500, 0),
        ("grocery store", 1200, 0),
        ("petrol pump", 3000, 0),
        ("restaurant bill", 800, 0),
        ("netflix subscription", 500, 0),
        ("electricity bill", 2200, 0),
        ("uber ride", 350, 0),
        ("flipkart order", 1800, 0),
        ("cafe coffee day", 200, 0),
    ]
    
    # Fraud examples (label = 1)
    fraud = [
        ("suspicious unknown payment", 50000, 1),
        ("unauthorized transaction", 25000, 1),
        ("fake subscription", 15000, 1),
        ("scam payment", 30000, 1),
        ("fraudulent charge", 45000, 1),
        ("unknown upi transfer", 75000, 1),
        ("suspicious activity", 100000, 1),
        ("unauthorized access", 20000, 1),
        ("fake merchant", 35000, 1),
        ("scam transaction", 60000, 1),
    ]
    
    # Add more variations
    for text, amount, label in non_fraud + fraud:
        data.append((clean_text(text), amount, label))
        # Add variations with different amounts
        if label == 0:  # Non-fraud
            data.append((clean_text(text), amount * 0.5, 0))
            data.append((clean_text(text), amount * 1.5, 0))
        else:  # Fraud
            data.append((clean_text(text), amount * 0.8, 1))
            data.append((clean_text(text), amount * 1.2, 1))
    
    return data

def train_models():
    """Train and save models"""
    print("🤖 Training ML models...")
    
    # Create directories
    os.makedirs("ML/models", exist_ok=True)
    os.makedirs("backend/models", exist_ok=True)
    
    # 1. Train category model
    print("📊 Training category model...")
    cat_data = create_sample_data()
    texts, categories = zip(*cat_data)
    texts_clean = [clean_text(text) for text in texts]
    
    # Create vectorizer and model
    vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
    cat_model = RandomForestClassifier(n_estimators=100, random_state=42)
    
    # Fit vectorizer and model
    X_vec = vectorizer.fit_transform(texts_clean)
    cat_model.fit(X_vec, categories)
    
    # Save category model and vectorizer
    joblib.dump(vectorizer, "ML/models/vectorizer.pkl")
    joblib.dump(cat_model, "ML/models/cat_model.pkl")
    joblib.dump(vectorizer, "backend/models/vectorizer.pkl")
    joblib.dump(cat_model, "backend/models/cat_model.pkl")
    
    print(f"✅ Category model trained with {len(set(categories))} categories")
    
    # 2. Train fraud model
    print("🔒 Training fraud model...")
    fraud_data = create_fraud_data()
    
    # Create DataFrame
    df = pd.DataFrame(fraud_data, columns=['text_clean', 'amount', 'is_fraud'])
    
    # Create fraud pipeline
    fraud_pipeline = Pipeline([
        ('preprocessor', ColumnTransformer([
            ('text', TfidfVectorizer(max_features=500), 'text_clean'),
            ('amount', StandardScaler(), ['amount'])
        ])),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
    # Fit fraud model
    X_fraud = df[['text_clean', 'amount']]
    y_fraud = df['is_fraud']
    fraud_pipeline.fit(X_fraud, y_fraud)
    
    # Save fraud model
    joblib.dump(fraud_pipeline, "ML/models/fraud_pipeline.pkl")
    joblib.dump(fraud_pipeline, "backend/models/fraud_pipeline.pkl")
    
    print("✅ Fraud model trained")
    
    # 3. Test models
    print("🧪 Testing models...")
    
    # Test category prediction
    test_text = "starbucks coffee purchase"
    test_vec = vectorizer.transform([clean_text(test_text)])
    pred_cat = cat_model.predict(test_vec)[0]
    pred_conf = cat_model.predict_proba(test_vec)[0].max()
    print(f"Category test: '{test_text}' -> {pred_cat} ({pred_conf:.2f})")
    
    # Test fraud prediction
    test_df = pd.DataFrame({
        'text_clean': [clean_text("suspicious unknown payment")],
        'amount': [50000]
    })
    fraud_pred = fraud_pipeline.predict(test_df)[0]
    fraud_prob = fraud_pipeline.predict_proba(test_df)[0][1]
    print(f"Fraud test: 'suspicious unknown payment' (₹50,000) -> {fraud_pred} ({fraud_prob:.2f})")
    
    print("🎉 Models trained and saved successfully!")
    return True

if __name__ == "__main__":
    try:
        train_models()
    except Exception as e:
        print(f"❌ Training failed: {e}")
        import traceback
        traceback.print_exc()