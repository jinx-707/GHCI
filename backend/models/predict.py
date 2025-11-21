import os
import re
import numpy as np
import pandas as pd
from typing import Tuple, List, Dict, Any
import joblib

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'cat_model.pkl')
VECT_PATH = os.path.join(os.path.dirname(__file__), 'vectorizer.pkl')
FRAUD_PATH = os.path.join(os.path.dirname(__file__), 'fraud_pipeline.pkl')

def clean_text(text: str) -> str:
    """Enhanced text cleaning for Indian context"""
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def format_rupees(amount: float) -> str:
    """Format amount in Indian rupees with proper formatting"""
    if amount >= 10000000:  # 1 crore
        return f"₹{amount/10000000:.1f}Cr"
    elif amount >= 100000:  # 1 lakh
        return f"₹{amount/100000:.1f}L"
    elif amount >= 1000:  # thousands
        return f"₹{amount/1000:.1f}K"
    else:
        return f"₹{amount:,.0f}"

class ModelPredictor:
    def __init__(self):
        self.vectorizer = None
        self.cat_model = None
        self.fraud_pipeline = None
        self._load()

    def _load(self):
        """Load enhanced ML models with compatibility handling"""
        try:
            import warnings
            warnings.filterwarnings('ignore', category=UserWarning)
            
            if os.path.exists(VECT_PATH) and os.path.exists(MODEL_PATH):
                try:
                    # Try loading with allow_pickle=True for compatibility
                    self.vectorizer = joblib.load(VECT_PATH)
                    self.cat_model = joblib.load(MODEL_PATH)
                    print("✅ Enhanced category model loaded")
                except Exception as e:
                    print(f"⚠️ Error loading models (version mismatch): {e}")
                    print("⚠️ Consider re-training models with current numpy version")
                    self.vectorizer = None
                    self.cat_model = None
            else:
                print("⚠️ Category model files not found")
                
            if os.path.exists(FRAUD_PATH):
                try:
                    self.fraud_pipeline = joblib.load(FRAUD_PATH)
                    print("✅ Enhanced fraud model loaded")
                except Exception as e:
                    print(f"⚠️ Error loading fraud model (version mismatch): {e}")
                    self.fraud_pipeline = None
            else:
                print("⚠️ Fraud model file not found")
                
        except Exception as e:
            print(f"❌ Error loading models: {e}")
            self.vectorizer = None
            self.cat_model = None
            self.fraud_pipeline = None

    def predict(self, text: str, amount: float = None) -> Dict[str, Any]:
        """Enhanced prediction with rupee support and better features"""
        text_clean = clean_text(text)
        
        result = {
            'text': text,
            'text_clean': text_clean,
            'amount': amount,
            'amount_formatted': format_rupees(amount) if amount else None,
            'category': 'Other',
            'category_confidence': 0.5,
            'fraud_probability': 0.0,
            'is_fraud': False,
            'fraud_risk_level': 'LOW',
            'model_version': 'enhanced'
        }
        
        # Enhanced category prediction with fallback
        if self.vectorizer and self.cat_model:
            try:
                text_vec = self.vectorizer.transform([text_clean])
                cat_pred = self.cat_model.predict(text_vec)[0]
                cat_proba = self.cat_model.predict_proba(text_vec)[0]
                cat_conf = np.max(cat_proba)
                
                # Use ML prediction if confidence is high enough, otherwise fallback
                if cat_conf > 0.6 and str(cat_pred) != 'Other':
                    result['category'] = str(cat_pred)
                    result['category_confidence'] = float(cat_conf)
                else:
                    # Use rule-based fallback for low confidence or "Other" predictions
                    fallback_cat = self._predict_category_fallback(text_clean)
                    result['category'] = fallback_cat
                    # Higher confidence for suspicious transactions
                    result['category_confidence'] = 0.95 if fallback_cat == 'Suspicious' else 0.85
                
                # Get top 3 categories
                top_indices = np.argsort(cat_proba)[-3:][::-1]
                result['top_categories'] = [
                    {
                        'category': self.cat_model.classes_[i],
                        'confidence': float(cat_proba[i])
                    }
                    for i in top_indices
                ]
                
            except Exception as e:
                print(f"Category prediction error: {e}")
                # Rule-based fallback
                result['category'] = self._predict_category_fallback(text_clean)
                result['category_confidence'] = 0.75
        else:
            # Rule-based prediction when no ML model
            result['category'] = self._predict_category_fallback(text_clean)
            result['category_confidence'] = 0.75
        
        # Enhanced fraud prediction with fallback
        if amount is not None:
            try:
                if self.fraud_pipeline:
                    # Create enhanced features for ML model
                    test_df = pd.DataFrame({
                        'text_clean': [text_clean],
                        'amount': [amount],
                        'amount_log': [np.log1p(amount)],
                        'text_length': [len(text_clean)],
                        'word_count': [len(text_clean.split())]
                    })
                    
                    fraud_pred = self.fraud_pipeline.predict(test_df)[0]
                    fraud_proba = self.fraud_pipeline.predict_proba(test_df)[0]
                    fraud_conf = fraud_proba[1] if len(fraud_proba) > 1 else fraud_proba[0]
                    
                    result['fraud_probability'] = float(fraud_conf)
                    result['is_fraud'] = bool(fraud_pred)
                else:
                    # Rule-based fraud detection fallback
                    fraud_score = 0.0
                    
                    # High amount risk (more realistic thresholds)
                    if amount > 200000:
                        fraud_score += 0.6
                    elif amount > 100000:
                        fraud_score += 0.4
                    elif amount > 50000:
                        fraud_score += 0.2
                    elif amount > 25000:
                        fraud_score += 0.1
                    
                    # Suspicious keywords - much more aggressive
                    suspicious_words = ['unknown', 'suspicious', 'fake', 'fraud', 'scam', 'unauthorized', 'refund', 'chargeback', 'upi', 'transfer']
                    suspicious_count = sum(1 for word in suspicious_words if word in text_clean)
                    if suspicious_count >= 2:  # Multiple suspicious words
                        fraud_score += 0.8
                    elif suspicious_count == 1:
                        fraud_score += 0.5
                    
                    # Unusual patterns
                    if len(text_clean.split()) < 3:
                        fraud_score += 0.2
                    
                    # Generic payment terms
                    generic_terms = ['payment', 'transfer', 'transaction', 'charge']
                    if any(term in text_clean for term in generic_terms) and len(text_clean.split()) < 4:
                        fraud_score += 0.3
                    
                    # Time-based (if available)
                    import datetime
                    current_hour = datetime.datetime.now().hour
                    if current_hour < 6 or current_hour > 23:  # Late night transactions
                        fraud_score += 0.1
                    
                    result['fraud_probability'] = min(fraud_score, 1.0)
                    result['is_fraud'] = fraud_score > 0.4
                
                # Enhanced risk levels
                fraud_conf = result['fraud_probability']
                if fraud_conf > 0.7:
                    result['fraud_risk_level'] = 'CRITICAL'
                elif fraud_conf > 0.5:
                    result['fraud_risk_level'] = 'HIGH'
                elif fraud_conf > 0.3:
                    result['fraud_risk_level'] = 'MEDIUM'
                else:
                    result['fraud_risk_level'] = 'LOW'
                
                # Risk factors
                risk_factors = []
                if amount > 100000:
                    risk_factors.append('Very high amount')
                elif amount > 50000:
                    risk_factors.append('High amount')
                elif amount > 25000:
                    risk_factors.append('Moderate amount')
                
                suspicious_words = ['unknown', 'suspicious', 'fake', 'fraud', 'scam', 'unauthorized']
                if any(word in text_clean for word in suspicious_words):
                    risk_factors.append('Suspicious keywords')
                
                if 'upi' in text_clean and any(word in text_clean for word in ['unknown', 'suspicious']):
                    risk_factors.append('Suspicious UPI transaction')
                
                if len(text_clean.split()) < 3:
                    risk_factors.append('Vague description')
                
                generic_terms = ['payment', 'transfer', 'transaction']
                if any(term in text_clean for term in generic_terms) and len(text_clean.split()) < 4:
                    risk_factors.append('Generic payment description')
                
                if result['fraud_probability'] > 0.4:
                    risk_factors.append('High risk pattern')
                elif result['fraud_probability'] > 0.2:
                    risk_factors.append('Medium risk pattern')
                
                result['risk_factors'] = risk_factors
                
            except Exception as e:
                print(f"Fraud prediction error: {e}")
                # Minimal fallback
                result['fraud_probability'] = 0.1
                result['is_fraud'] = False
                result['fraud_risk_level'] = 'LOW'
                result['risk_factors'] = []
        
        return result

    def predict_category_only(self, text: str) -> Tuple[str, float]:
        """Legacy method for backward compatibility"""
        result = self.predict(text)
        return result['category'], result['category_confidence']

    def batch_predict(self, transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Enhanced batch prediction with performance optimization"""
        results = []
        
        for transaction in transactions:
            text = transaction.get('text', transaction.get('description', ''))
            amount = transaction.get('amount')
            
            result = self.predict(text, amount)
            result.update(transaction)  # Include original transaction data
            results.append(result)
        
        return results

    def _predict_category_fallback(self, text_clean: str) -> str:
        """Rule-based category prediction fallback"""
        text_lower = text_clean.lower()
        
        # Suspicious/Fraud keywords - highest priority
        if any(word in text_lower for word in ['suspicious', 'unknown', 'fake', 'fraud', 'scam', 'unauthorized']):
            return 'Suspicious'
        
        # Dining keywords
        if any(word in text_lower for word in ['coffee', 'starbucks', 'restaurant', 'food', 'cafe', 'pizza', 'burger', 'kfc', 'mcdonalds', 'dominos']):
            return 'Dining'
        
        # Shopping keywords  
        if any(word in text_lower for word in ['amazon', 'flipkart', 'shopping', 'mall', 'store', 'purchase', 'buy']):
            return 'Shopping'
        
        # Transportation keywords
        if any(word in text_lower for word in ['uber', 'ola', 'taxi', 'petrol', 'fuel', 'gas', 'transport', 'bus', 'train']):
            return 'Transportation'
        
        # Entertainment keywords
        if any(word in text_lower for word in ['netflix', 'hotstar', 'movie', 'cinema', 'subscription', 'spotify', 'youtube']):
            return 'Entertainment'
        
        # Groceries keywords
        if any(word in text_lower for word in ['grocery', 'bazaar', 'mart', 'supermarket', 'vegetables', 'fruits']):
            return 'Groceries'
        
        # Banking keywords
        if any(word in text_lower for word in ['bank', 'emi', 'loan', 'credit', 'debit', 'atm']):
            return 'Banking'
        
        # Utilities keywords
        if any(word in text_lower for word in ['electricity', 'water', 'gas', 'internet', 'phone', 'mobile']):
            return 'Utilities'
        
        # Generic UPI/Payment terms
        if any(word in text_lower for word in ['upi', 'payment', 'transfer']) and len(text_lower.split()) < 4:
            return 'Transfer'
        
        return 'Other'

    def get_spending_insights(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate spending insights from transactions"""
        if not transactions:
            return {'error': 'No transactions provided'}
        
        # Predict all transactions
        predictions = self.batch_predict(transactions)
        
        # Calculate insights
        total_amount = sum(t.get('amount', 0) for t in transactions)
        fraud_count = sum(1 for p in predictions if p.get('is_fraud', False))
        
        # Category breakdown
        category_totals = {}
        for p in predictions:
            cat = p.get('category', 'Other')
            amount = p.get('amount', 0)
            category_totals[cat] = category_totals.get(cat, 0) + amount
        
        # Top categories
        top_categories = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return {
            'total_transactions': len(transactions),
            'total_amount': total_amount,
            'total_amount_formatted': format_rupees(total_amount),
            'fraud_transactions': fraud_count,
            'fraud_percentage': (fraud_count / len(transactions)) * 100,
            'category_breakdown': dict(category_totals),
            'top_categories': [
                {
                    'category': cat,
                    'amount': amt,
                    'amount_formatted': format_rupees(amt),
                    'percentage': (amt / total_amount) * 100
                }
                for cat, amt in top_categories
            ],
            'average_transaction': total_amount / len(transactions),
            'average_transaction_formatted': format_rupees(total_amount / len(transactions))
        }