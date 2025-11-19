import os
import sys
from pathlib import Path

# Add ML directory to path
ml_dir = Path(__file__).parent.parent.parent / "ML"
sys.path.append(str(ml_dir))

from advanced_ml import AdvancedTransactionClassifier

class AdvancedModelPredictor:
    def __init__(self):
        self.classifier = AdvancedTransactionClassifier()
        self._load()
    
    def _load(self):
        """Load the advanced ML models"""
        try:
            # Try to load from ML/models directory
            ml_models_path = Path(__file__).parent.parent.parent / "ML" / "models"
            if ml_models_path.exists():
                os.chdir(ml_models_path.parent)
                success = self.classifier.load_models()
                if success:
                    print("✅ Advanced ML models loaded successfully")
                    return
            
            print("⚠️ Advanced models not found, using fallback")
        except Exception as e:
            print(f"❌ Error loading advanced models: {e}")
    
    def predict(self, text: str, amount: float = None):
        """Make advanced prediction"""
        return self.classifier.predict(text, amount)
    
    def predict_category_only(self, text: str):
        """Legacy method for backward compatibility"""
        result = self.predict(text)
        return result['category'], result['category_confidence']
    
    def batch_predict(self, transactions):
        """Batch prediction"""
        results = []
        for transaction in transactions:
            text = transaction.get('text', transaction.get('description', ''))
            amount = transaction.get('amount')
            result = self.predict(text, amount)
            result.update(transaction)
            results.append(result)
        return results