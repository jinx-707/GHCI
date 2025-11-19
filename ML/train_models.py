#!/usr/bin/env python3
"""
Simple ML model training script for GHCI
"""
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import re

def clean_text(text):
    """Clean and normalize text"""
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def train_category_model():
    """Train transaction categorization model"""
    print("Training category classification model...")
    
    # Load data
    df = pd.read_csv('data/training_data.csv')
    
    # Clean text
    df['text_clean'] = df['text'].apply(clean_text)
    
    # Prepare data
    X = df['text_clean']
    y = df['category']
    
    # Check class distribution
    print(f"Categories: {y.value_counts().to_dict()}")
    
    # Split data (no stratify due to small dataset)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )
    
    # Vectorize text
    vectorizer = TfidfVectorizer(
        max_features=3000,
        ngram_range=(1, 2),
        stop_words='english',
        min_df=1
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    # Train model
    model = LogisticRegression(
        multi_class='multinomial',
        solver='lbfgs',
        max_iter=1000,
        random_state=42,
        C=1.0
    )
    model.fit(X_train_vec, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_vec)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Category Model Accuracy: {accuracy:.3f}")
    print(f"Classes: {model.classes_}")
    
    # Save models
    os.makedirs('models', exist_ok=True)
    joblib.dump(vectorizer, 'models/vectorizer.pkl')
    joblib.dump(model, 'models/cat_model.pkl')
    
    return vectorizer, model

def train_fraud_model():
    """Train fraud detection model"""
    print("\nTraining fraud detection model...")
    
    # Load data
    df = pd.read_csv('data/training_data.csv')
    
    # Clean text
    df['text_clean'] = df['text'].apply(clean_text)
    
    # Check fraud distribution
    print(f"Fraud distribution: {df['fraud'].value_counts().to_dict()}")
    
    # Prepare features
    X_text = df['text_clean']
    X_amount = df['amount'].values.reshape(-1, 1)
    y = df['fraud']
    
    # Split data
    X_text_train, X_text_test, X_amount_train, X_amount_test, y_train, y_test = train_test_split(
        X_text, X_amount, y, test_size=0.3, random_state=42
    )
    
    # Vectorize text
    vectorizer = TfidfVectorizer(
        max_features=2000,
        ngram_range=(1, 2),
        stop_words='english',
        min_df=1
    )
    X_text_train_vec = vectorizer.fit_transform(X_text_train)
    X_text_test_vec = vectorizer.transform(X_text_test)
    
    # Combine text and amount features
    from scipy.sparse import hstack
    from sklearn.preprocessing import StandardScaler
    
    scaler = StandardScaler()
    X_amount_train_scaled = scaler.fit_transform(X_amount_train)
    X_amount_test_scaled = scaler.transform(X_amount_test)
    
    X_train_combined = hstack([X_text_train_vec, X_amount_train_scaled])
    X_test_combined = hstack([X_text_test_vec, X_amount_test_scaled])
    
    # Train model
    model = LogisticRegression(
        class_weight='balanced',
        random_state=42,
        max_iter=1000,
        C=1.0
    )
    model.fit(X_train_combined, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_combined)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Fraud Model Accuracy: {accuracy:.3f}")
    
    # Save fraud model components
    fraud_pipeline = {
        'text_vectorizer': vectorizer,
        'amount_scaler': scaler,
        'model': model
    }
    joblib.dump(fraud_pipeline, 'models/fraud_pipeline.pkl')
    
    return fraud_pipeline

def create_simple_predictor():
    """Create a simple prediction interface"""
    print("\nCreating prediction interface...")
    
    # Load models
    try:
        vectorizer = joblib.load('models/vectorizer.pkl')
        cat_model = joblib.load('models/cat_model.pkl')
        fraud_pipeline = joblib.load('models/fraud_pipeline.pkl')
        
        def predict_transaction(text, amount=None):
            """Predict category and fraud for a transaction"""
            text_clean = clean_text(text)
            
            # Category prediction
            text_vec = vectorizer.transform([text_clean])
            cat_probs = cat_model.predict_proba(text_vec)[0]
            cat_pred = cat_model.classes_[np.argmax(cat_probs)]
            cat_conf = np.max(cat_probs)
            
            # Fraud prediction
            fraud_result = None
            if amount is not None:
                text_vec_fraud = fraud_pipeline['text_vectorizer'].transform([text_clean])
                amount_scaled = fraud_pipeline['amount_scaler'].transform([[amount]])
                
                from scipy.sparse import hstack
                combined_features = hstack([text_vec_fraud, amount_scaled])
                
                fraud_probs = fraud_pipeline['model'].predict_proba(combined_features)[0]
                fraud_pred = fraud_pipeline['model'].predict(combined_features)[0]
                fraud_conf = fraud_probs[1] if len(fraud_probs) > 1 else fraud_probs[0]
                
                fraud_result = {
                    'is_fraud': bool(fraud_pred),
                    'fraud_probability': float(fraud_conf)
                }
            
            return {
                'category': cat_pred,
                'category_confidence': float(cat_conf),
                'fraud': fraud_result
            }
        
        # Test the predictor
        test_cases = [
            ("Starbucks coffee purchase", 5.50),
            ("Amazon online shopping", 89.99),
            ("Suspicious unknown charge", 299.99),
            ("Shell gas station", 45.20),
            ("Netflix subscription", 15.99),
            ("Walmart grocery shopping", 125.30)
        ]
        
        print("\nTesting predictions:")
        for text, amount in test_cases:
            result = predict_transaction(text, amount)
            print(f"Text: {text}")
            print(f"Amount: ${amount}")
            print(f"Category: {result['category']} (conf: {result['category_confidence']:.3f})")
            if result['fraud']:
                fraud_risk = "HIGH" if result['fraud']['fraud_probability'] > 0.5 else "LOW"
                print(f"Fraud Risk: {fraud_risk} ({result['fraud']['fraud_probability']:.3f})")
            print("-" * 50)
        
        return predict_transaction
        
    except Exception as e:
        print(f"Error loading models: {e}")
        return None

if __name__ == "__main__":
    print("🤖 Training GHCI ML Models")
    print("=" * 40)
    
    # Train models
    vectorizer, cat_model = train_category_model()
    fraud_pipeline = train_fraud_model()
    
    # Create predictor
    predictor = create_simple_predictor()
    
    print("\n✅ Training complete!")
    print("Models saved to: models/")
    print("- vectorizer.pkl")
    print("- cat_model.pkl") 
    print("- fraud_pipeline.pkl")