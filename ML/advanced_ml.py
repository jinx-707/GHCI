#!/usr/bin/env python3
"""
Advanced ML system for GHCI with proper NLP and classification
"""
import pandas as pd
import numpy as np
import re
import string
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import Pipeline
import joblib
import os

class AdvancedTransactionClassifier:
    def __init__(self):
        self.category_model = None
        self.fraud_model = None
        self.vectorizer = None
        self.scaler = None
        self.label_encoder = None
        
    def preprocess_text(self, text):
        """Advanced text preprocessing"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = str(text).lower()
        
        # Remove special characters but keep spaces
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Handle common abbreviations and variations
        replacements = {
            'starbucks': 'coffee shop',
            'mcdonalds': 'fast food',
            'amazon': 'online shopping',
            'flipkart': 'online shopping',
            'uber': 'ride sharing',
            'ola': 'ride sharing',
            'netflix': 'streaming service',
            'hotstar': 'streaming service',
            'paytm': 'digital payment',
            'gpay': 'digital payment',
            'phonepe': 'digital payment'
        }
        
        for old, new in replacements.items():
            text = text.replace(old, new)
        
        return text
    
    def extract_features(self, texts, amounts=None):
        """Extract advanced features from transaction data"""
        features = []
        
        for i, text in enumerate(texts):
            text_clean = self.preprocess_text(text)
            amount = amounts[i] if amounts else 0
            
            # Text features
            word_count = len(text_clean.split())
            char_count = len(text_clean)
            
            # Amount features
            amount_log = np.log1p(amount) if amount > 0 else 0
            
            # Pattern features
            has_numbers = bool(re.search(r'\d', text_clean))
            has_brand = any(brand in text_clean for brand in [
                'coffee shop', 'fast food', 'online shopping', 'ride sharing',
                'streaming service', 'digital payment'
            ])
            
            # Suspicious patterns
            suspicious_words = ['unknown', 'suspicious', 'unauthorized', 'fake', 'fraud']
            has_suspicious = any(word in text_clean for word in suspicious_words)
            
            features.append({
                'text_clean': text_clean,
                'word_count': word_count,
                'char_count': char_count,
                'amount': amount,
                'amount_log': amount_log,
                'has_numbers': has_numbers,
                'has_brand': has_brand,
                'has_suspicious': has_suspicious
            })
        
        return features
    
    def train_models(self, data_path='data/training_data.csv'):
        """Train advanced ML models"""
        print("🤖 Training Advanced ML Models")
        print("=" * 40)
        
        # Load data
        df = pd.read_csv(data_path)
        print(f"Loaded {len(df)} transactions")
        
        # Extract features
        features = self.extract_features(df['text'].tolist(), df['amount'].tolist())
        feature_df = pd.DataFrame(features)
        
        # Prepare text vectorization
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 3),
            stop_words='english',
            min_df=2,
            max_df=0.8,
            sublinear_tf=True
        )
        
        text_features = self.vectorizer.fit_transform(feature_df['text_clean'])
        
        # Prepare numeric features
        numeric_cols = ['word_count', 'char_count', 'amount', 'amount_log', 
                       'has_numbers', 'has_brand', 'has_suspicious']
        numeric_features = feature_df[numeric_cols].values
        
        self.scaler = StandardScaler()
        numeric_features_scaled = self.scaler.fit_transform(numeric_features)
        
        # Combine features
        from scipy.sparse import hstack
        combined_features = hstack([text_features, numeric_features_scaled])
        
        # Train Category Model
        print("\n📊 Training Category Classifier...")
        self.label_encoder = LabelEncoder()
        y_category = self.label_encoder.fit_transform(df['category'])
        
        # Use Gradient Boosting for better performance
        self.category_model = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        
        # Cross validation
        cv_scores = cross_val_score(self.category_model, combined_features, y_category, cv=3)
        print(f"Category CV Accuracy: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
        
        self.category_model.fit(combined_features, y_category)
        
        # Train Fraud Model
        print("\n🔒 Training Fraud Detector...")
        y_fraud = df['fraud'].values
        
        self.fraud_model = RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            class_weight='balanced',
            random_state=42
        )
        
        cv_fraud = cross_val_score(self.fraud_model, combined_features, y_fraud, cv=3)
        print(f"Fraud CV Accuracy: {cv_fraud.mean():.3f} ± {cv_fraud.std():.3f}")
        
        self.fraud_model.fit(combined_features, y_fraud)
        
        # Save models
        self.save_models()
        
        # Test predictions
        self.test_predictions()
        
        return True
    
    def predict(self, text, amount=None):
        """Make advanced predictions"""
        if not self.category_model or not self.fraud_model:
            return self.fallback_predict(text, amount)
        
        try:
            # Extract features
            features = self.extract_features([text], [amount] if amount else [0])
            feature_df = pd.DataFrame(features)
            
            # Vectorize text
            text_features = self.vectorizer.transform(feature_df['text_clean'])
            
            # Scale numeric features
            numeric_cols = ['word_count', 'char_count', 'amount', 'amount_log', 
                           'has_numbers', 'has_brand', 'has_suspicious']
            numeric_features = feature_df[numeric_cols].values
            numeric_features_scaled = self.scaler.transform(numeric_features)
            
            # Combine features
            from scipy.sparse import hstack
            combined_features = hstack([text_features, numeric_features_scaled])
            
            # Category prediction
            cat_pred = self.category_model.predict(combined_features)[0]
            cat_proba = self.category_model.predict_proba(combined_features)[0]
            category = self.label_encoder.inverse_transform([cat_pred])[0]
            confidence = np.max(cat_proba)
            
            # Fraud prediction
            fraud_pred = self.fraud_model.predict(combined_features)[0]
            fraud_proba = self.fraud_model.predict_proba(combined_features)[0]
            fraud_confidence = fraud_proba[1] if len(fraud_proba) > 1 else fraud_proba[0]
            
            # Risk level
            if fraud_confidence > 0.8:
                risk_level = 'CRITICAL'
            elif fraud_confidence > 0.6:
                risk_level = 'HIGH'
            elif fraud_confidence > 0.4:
                risk_level = 'MEDIUM'
            else:
                risk_level = 'LOW'
            
            # Format amount
            amount_formatted = self.format_rupees(amount) if amount else None
            
            return {
                'category': category,
                'category_confidence': float(confidence),
                'fraud_probability': float(fraud_confidence),
                'fraud_risk_level': risk_level,
                'is_fraud': bool(fraud_pred),
                'amount_formatted': amount_formatted,
                'model_version': 'advanced_ml'
            }
            
        except Exception as e:
            print(f"Advanced prediction error: {e}")
            return self.fallback_predict(text, amount)
    
    def fallback_predict(self, text, amount):
        """Fallback prediction using rules"""
        text_lower = text.lower()
        
        # Simple rule-based category prediction
        if any(word in text_lower for word in ['coffee', 'restaurant', 'food', 'cafe']):
            category = 'Dining'
            confidence = 0.7
        elif any(word in text_lower for word in ['amazon', 'shopping', 'store']):
            category = 'Shopping'
            confidence = 0.6
        elif any(word in text_lower for word in ['petrol', 'fuel', 'gas']):
            category = 'Transportation'
            confidence = 0.8
        elif any(word in text_lower for word in ['netflix', 'subscription']):
            category = 'Entertainment'
            confidence = 0.7
        else:
            category = 'Other'
            confidence = 0.5
        
        # Simple fraud detection
        fraud_prob = 0.1
        if any(word in text_lower for word in ['suspicious', 'unknown', 'fake']):
            fraud_prob = 0.8
        elif amount and amount > 50000:
            fraud_prob = 0.6
        
        return {
            'category': category,
            'category_confidence': confidence,
            'fraud_probability': fraud_prob,
            'fraud_risk_level': 'HIGH' if fraud_prob > 0.5 else 'LOW',
            'is_fraud': fraud_prob > 0.5,
            'amount_formatted': self.format_rupees(amount) if amount else None,
            'model_version': 'fallback'
        }
    
    def format_rupees(self, amount):
        """Format amount in Indian rupees"""
        if not amount:
            return None
        
        if amount >= 10000000:
            return f"₹{amount/10000000:.1f}Cr"
        elif amount >= 100000:
            return f"₹{amount/100000:.1f}L"
        elif amount >= 1000:
            return f"₹{amount/1000:.1f}K"
        else:
            return f"₹{amount:,.0f}"
    
    def save_models(self):
        """Save trained models"""
        os.makedirs('models', exist_ok=True)
        
        joblib.dump(self.vectorizer, 'models/advanced_vectorizer.pkl')
        joblib.dump(self.category_model, 'models/advanced_category.pkl')
        joblib.dump(self.fraud_model, 'models/advanced_fraud.pkl')
        joblib.dump(self.scaler, 'models/advanced_scaler.pkl')
        joblib.dump(self.label_encoder, 'models/advanced_encoder.pkl')
        
        print("✅ Advanced models saved successfully")
    
    def load_models(self):
        """Load trained models"""
        try:
            self.vectorizer = joblib.load('models/advanced_vectorizer.pkl')
            self.category_model = joblib.load('models/advanced_category.pkl')
            self.fraud_model = joblib.load('models/advanced_fraud.pkl')
            self.scaler = joblib.load('models/advanced_scaler.pkl')
            self.label_encoder = joblib.load('models/advanced_encoder.pkl')
            print("✅ Advanced models loaded successfully")
            return True
        except Exception as e:
            print(f"❌ Failed to load models: {e}")
            return False
    
    def test_predictions(self):
        """Test the trained models"""
        print("\n🧪 Testing Advanced Models...")
        
        test_cases = [
            ("Starbucks Coffee Day purchase", 450),
            ("Amazon Flipkart online shopping", 7500),
            ("Suspicious unknown UPI payment", 25000),
            ("HDFC Bank EMI payment", 155000),
            ("Netflix Hotstar subscription", 1300),
            ("Shell HP petrol pump fuel", 3800)
        ]
        
        for text, amount in test_cases:
            result = self.predict(text, amount)
            print(f"Text: {text}")
            print(f"Amount: {result['amount_formatted']}")
            print(f"Category: {result['category']} ({result['category_confidence']:.3f})")
            print(f"Fraud: {result['fraud_risk_level']} ({result['fraud_probability']:.3f})")
            print("-" * 40)

if __name__ == "__main__":
    classifier = AdvancedTransactionClassifier()
    classifier.train_models()
    print("\n🎉 Advanced ML system ready!")