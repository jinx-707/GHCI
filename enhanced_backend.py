from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import json
import os
from datetime import datetime, timedelta
import re
from typing import List, Dict, Optional
import pickle
import numpy as np

app = FastAPI(title="FinCoach AI Enhanced Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model if available
try:
    with open('ML/transaction_model.pkl', 'rb') as f:
        ml_model = pickle.load(f)
    ML_AVAILABLE = True
except:
    ML_AVAILABLE = False

# Data storage
transactions_db = []
feedback_log = []
user_corrections = {}

# Models
class Transaction(BaseModel):
    id: Optional[str] = None
    description: str
    amount: float
    date: str
    category: Optional[str] = None
    confidence: Optional[float] = None
    predicted_by: Optional[str] = "rule"

class FeedbackCorrection(BaseModel):
    transaction_id: str
    original_category: str
    corrected_category: str
    confidence: float

class CategoryPrediction(BaseModel):
    category: str
    confidence: float
    reasoning: str
    method: str

# Enhanced categorization with ML + rules
def categorize_transaction(description: str, amount: float) -> CategoryPrediction:
    description_lower = description.lower()
    
    # Try ML model first
    if ML_AVAILABLE:
        try:
            # Feature extraction for ML
            features = extract_features(description, amount)
            prediction = ml_model.predict([features])[0]
            confidence = max(ml_model.predict_proba([features])[0])
            
            if confidence > 0.7:
                return CategoryPrediction(
                    category=prediction,
                    confidence=confidence,
                    reasoning=f"ML model identified keywords and patterns",
                    method="ml"
                )
        except:
            pass
    
    # Fallback to enhanced rule-based system
    rules = {
        "Dining": ["starbucks", "cafe", "restaurant", "food", "zomato", "swiggy", "dominos", "pizza", "coffee", "chai"],
        "Shopping": ["amazon", "flipkart", "mall", "store", "shop", "myntra", "ajio", "purchase"],
        "Transportation": ["uber", "ola", "petrol", "fuel", "metro", "bus", "taxi", "parking"],
        "Utilities": ["electricity", "water", "gas", "internet", "phone", "mobile", "recharge"],
        "Groceries": ["grocery", "supermarket", "vegetables", "fruits", "milk", "bread"],
        "Entertainment": ["movie", "cinema", "netflix", "spotify", "game", "book"],
        "Healthcare": ["hospital", "doctor", "medicine", "pharmacy", "clinic"],
        "Education": ["school", "college", "course", "book", "tuition"],
    }
    
    for category, keywords in rules.items():
        for keyword in keywords:
            if keyword in description_lower:
                confidence = 0.85 if len([k for k in keywords if k in description_lower]) > 1 else 0.75
                return CategoryPrediction(
                    category=category,
                    confidence=confidence,
                    reasoning=f"Matched keyword: '{keyword}'",
                    method="rule"
                )
    
    return CategoryPrediction(
        category="Other",
        confidence=0.3,
        reasoning="No clear pattern found",
        method="rule"
    )

def extract_features(description: str, amount: float) -> List[float]:
    """Extract features for ML model"""
    features = []
    
    # Amount-based features
    features.append(amount)
    features.append(1 if amount > 1000 else 0)
    features.append(1 if amount < 100 else 0)
    
    # Text-based features
    desc_lower = description.lower()
    keywords = ["food", "shop", "fuel", "movie", "hospital", "school"]
    for keyword in keywords:
        features.append(1 if keyword in desc_lower else 0)
    
    # Length and character features
    features.append(len(description))
    features.append(1 if any(char.isdigit() for char in description) else 0)
    
    return features

@app.post("/api/v1/upload-transactions")
async def upload_transactions(file: UploadFile = File(...)):
    """Upload and process CSV transactions"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")
    
    try:
        content = await file.read()
        from io import StringIO
        df = pd.read_csv(StringIO(content.decode('utf-8')))
        
        # Expected columns: description, amount, date
        required_cols = ['description', 'amount', 'date']
        if not all(col in df.columns for col in required_cols):
            raise HTTPException(status_code=400, detail=f"CSV must have columns: {required_cols}")
        
        processed_transactions = []
        for _, row in df.iterrows():
            prediction = categorize_transaction(row['description'], float(row['amount']))
            
            transaction = {
                "id": f"TXN_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{len(transactions_db)}",
                "description": row['description'],
                "amount": float(row['amount']),
                "date": row['date'],
                "category": prediction.category,
                "confidence": prediction.confidence,
                "reasoning": prediction.reasoning,
                "method": prediction.method,
                "timestamp": datetime.now().isoformat()
            }
            
            transactions_db.append(transaction)
            processed_transactions.append(transaction)
        
        return {
            "message": f"Successfully processed {len(processed_transactions)} transactions",
            "transactions": processed_transactions,
            "ml_used": ML_AVAILABLE
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/api/v1/feedback/correct")
async def submit_feedback(correction: FeedbackCorrection):
    """Submit user correction for ML learning"""
    
    # Find the transaction
    transaction = next((t for t in transactions_db if t["id"] == correction.transaction_id), None)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Log feedback
    feedback_entry = {
        "transaction_id": correction.transaction_id,
        "original_category": correction.original_category,
        "corrected_category": correction.corrected_category,
        "confidence": correction.confidence,
        "description": transaction["description"],
        "amount": transaction["amount"],
        "timestamp": datetime.now().isoformat(),
        "feedback_source": "user_manual"
    }
    
    feedback_log.append(feedback_entry)
    user_corrections[correction.transaction_id] = correction.corrected_category
    
    # Update transaction
    transaction["category"] = correction.corrected_category
    transaction["confidence"] = 0.95
    transaction["method"] = "user_corrected"
    transaction["reasoning"] = "User correction applied"
    
    # Save feedback to file for future ML training
    try:
        with open('feedback_log.json', 'w') as f:
            json.dump(feedback_log, f, indent=2)
    except:
        pass
    
    return {
        "message": "Feedback recorded successfully",
        "updated_transaction": transaction,
        "total_corrections": len(feedback_log)
    }

@app.get("/api/v1/transactions")
async def get_transactions():
    """Get all transactions with predictions"""
    return {
        "transactions": transactions_db[-50:],  # Last 50 transactions
        "total": len(transactions_db),
        "ml_available": ML_AVAILABLE,
        "corrections_count": len(feedback_log)
    }

@app.get("/api/v1/analytics/confidence")
async def get_confidence_analytics():
    """Get confidence score analytics"""
    if not transactions_db:
        return {"message": "No transactions available"}
    
    confidences = [t.get("confidence", 0) for t in transactions_db]
    methods = {}
    for t in transactions_db:
        method = t.get("method", "unknown")
        methods[method] = methods.get(method, 0) + 1
    
    return {
        "avg_confidence": sum(confidences) / len(confidences),
        "high_confidence": len([c for c in confidences if c > 0.8]),
        "low_confidence": len([c for c in confidences if c < 0.5]),
        "methods_used": methods,
        "total_transactions": len(transactions_db)
    }

@app.get("/api/v1/analytics/categories")
async def get_category_analytics():
    """Get category-wise spending analytics"""
    if not transactions_db:
        return {"categories": {}, "total_spent": 0}
    
    categories = {}
    total_spent = 0
    
    for transaction in transactions_db:
        category = transaction.get("category", "Other")
        amount = transaction.get("amount", 0)
        
        if category not in categories:
            categories[category] = {
                "total": 0,
                "count": 0,
                "avg_confidence": 0,
                "transactions": []
            }
        
        categories[category]["total"] += amount
        categories[category]["count"] += 1
        categories[category]["transactions"].append({
            "id": transaction["id"],
            "description": transaction["description"],
            "amount": amount,
            "confidence": transaction.get("confidence", 0)
        })
        total_spent += amount
    
    # Calculate average confidence per category
    for category in categories:
        confidences = [t["confidence"] for t in categories[category]["transactions"]]
        categories[category]["avg_confidence"] = sum(confidences) / len(confidences)
        # Keep only summary, not all transactions
        categories[category]["sample_transactions"] = categories[category]["transactions"][:3]
        del categories[category]["transactions"]
    
    return {
        "categories": categories,
        "total_spent": total_spent,
        "category_count": len(categories)
    }

@app.post("/api/v1/predict")
async def predict_category(request: Request):
    """Predict category for a single transaction"""
    try:
        data = await request.json()
        description = data.get("description", "")
        amount = data.get("amount", 0)
        
        prediction = categorize_transaction(description, amount)
        
        return {
            "category": prediction.category,
            "confidence": prediction.confidence,
            "reasoning": prediction.reasoning,
            "method": prediction.method,
            "ml_available": ML_AVAILABLE
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")

@app.get("/api/v1/model/performance")
async def get_model_performance():
    """Get model performance metrics"""
    if not transactions_db:
        return {"message": "No data available"}
    
    total = len(transactions_db)
    high_conf = len([t for t in transactions_db if t.get("confidence", 0) > 0.8])
    user_corrected = len([t for t in transactions_db if t.get("method") == "user_corrected"])
    
    return {
        "total_predictions": total,
        "high_confidence_rate": high_conf / total if total > 0 else 0,
        "user_correction_rate": user_corrected / total if total > 0 else 0,
        "ml_available": ML_AVAILABLE,
        "feedback_entries": len(feedback_log),
        "accuracy_estimate": (high_conf + user_corrected) / total if total > 0 else 0
    }

@app.get("/api/v1/status")
async def get_status():
    return {
        "status": "Enhanced FinCoach AI Backend Running",
        "ml_model_loaded": ML_AVAILABLE,
        "total_transactions": len(transactions_db),
        "feedback_entries": len(feedback_log),
        "features": [
            "ML-powered categorization",
            "Confidence scoring",
            "User feedback system",
            "CSV upload processing",
            "Real-time analytics"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)