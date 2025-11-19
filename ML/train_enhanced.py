#!/usr/bin/env python3
"""
Enhanced ML training for GHCI with better performance
"""
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import joblib
import os
import re

def clean_text(text):
    """Enhanced text cleaning"""
    text = str(text).lower()
    # Keep Indian terms
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def train_enhanced_models():
    """Train enhanced ML models with better performance"""
    print("🚀 Training Enhanced GHCI ML Models")
    print("=" * 50)
    
    # Load data
    df = pd.read_csv('data/training_data.csv')
    df['text_clean'] = df['text'].apply(clean_text)
    
    print(f"Dataset: {len(df)} transactions")
    print(f"Categories: {df['category'].nunique()}")
    print(f"Fraud cases: {df['fraud'].sum()}")
    
    # Enhanced Category Model
    print("\n📊 Training Category Classifier...")
    X_cat = df['text_clean']
    y_cat = df['category']
    
    # Better vectorizer
    vectorizer = TfidfVectorizer(
        max_features=8000,
        ngram_range=(1, 3),
        stop_words='english',
        min_df=1,
        max_df=0.95,
        sublinear_tf=True
    )
    
    X_cat_vec = vectorizer.fit_transform(X_cat)
    
    # Use Random Forest for better accuracy
    cat_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    
    # Cross validation
    cv_scores = cross_val_score(cat_model, X_cat_vec, y_cat, cv=3)
    print(f"Category CV Accuracy: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
    
    cat_model.fit(X_cat_vec, y_cat)
    
    # Enhanced Fraud Model
    print("\n🔒 Training Fraud Detector...")
    
    # Create enhanced features
    df['amount_log'] = np.log1p(df['amount'])
    df['text_length'] = df['text_clean'].str.len()
    df['word_count'] = df['text_clean'].str.split().str.len()
    
    # Feature engineering pipeline
    text_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            stop_words='english',
            min_df=1
        ))
    ])
    
    numeric_features = ['amount', 'amount_log', 'text_length', 'word_count']
    numeric_pipeline = Pipeline([
        ('scaler', StandardScaler())
    ])
    
    preprocessor = ColumnTransformer([
        ('text', text_pipeline, 'text_clean'),
        ('num', numeric_pipeline, numeric_features)
    ])
    
    fraud_pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', LogisticRegression(
            class_weight='balanced',
            random_state=42,
            max_iter=2000,
            C=0.1
        ))
    ])
    
    # Prepare fraud data
    fraud_features = ['text_clean'] + numeric_features
    X_fraud = df[fraud_features]
    y_fraud = df['fraud']
    
    # Cross validation for fraud
    cv_fraud = cross_val_score(fraud_pipeline, X_fraud, y_fraud, cv=3)
    print(f"Fraud CV Accuracy: {cv_fraud.mean():.3f} ± {cv_fraud.std():.3f}")
    
    fraud_pipeline.fit(X_fraud, y_fraud)
    
    # Save models
    os.makedirs('models', exist_ok=True)
    joblib.dump(vectorizer, 'models/vectorizer.pkl')
    joblib.dump(cat_model, 'models/cat_model.pkl')
    joblib.dump(fraud_pipeline, 'models/fraud_pipeline.pkl')
    
    # Test predictions
    print("\n🧪 Testing Enhanced Models...")
    test_cases = [
        ("Starbucks coffee purchase", 450),
        ("Amazon shopping order", 7500),
        ("Suspicious unknown UPI", 25000),
        ("HDFC bank EMI payment", 155000),
        ("Fake subscription charge", 2500)
    ]
    
    for text, amount in test_cases:
        text_clean = clean_text(text)
        
        # Category prediction
        text_vec = vectorizer.transform([text_clean])
        cat_pred = cat_model.predict(text_vec)[0]
        cat_proba = cat_model.predict_proba(text_vec)[0].max()
        
        # Fraud prediction
        test_df = pd.DataFrame({
            'text_clean': [text_clean],
            'amount': [amount],
            'amount_log': [np.log1p(amount)],
            'text_length': [len(text_clean)],
            'word_count': [len(text_clean.split())]
        })
        
        fraud_pred = fraud_pipeline.predict(test_df)[0]
        fraud_proba = fraud_pipeline.predict_proba(test_df)[0][1]
        
        print(f"Text: {text}")
        print(f"Amount: ₹{amount:,}")
        print(f"Category: {cat_pred} (conf: {cat_proba:.3f})")
        print(f"Fraud: {'HIGH' if fraud_proba > 0.5 else 'LOW'} ({fraud_proba:.3f})")
        print("-" * 40)
    
    return vectorizer, cat_model, fraud_pipeline

if __name__ == "__main__":
    vectorizer, cat_model, fraud_pipeline = train_enhanced_models()
    print("\n✅ Enhanced models trained successfully!")
    print("Models saved with improved accuracy and Indian rupee support")