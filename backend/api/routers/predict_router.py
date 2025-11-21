from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

router = APIRouter()

class PredictRequest(BaseModel):
    text: str
    amount: Optional[float] = None

class BatchPredictRequest(BaseModel):
    transactions: List[Dict[str, Any]]

class InsightsRequest(BaseModel):
    transactions: List[Dict[str, Any]]

@router.post('/predict')
async def predict_transaction(req: PredictRequest, request: Request):
    """Enhanced prediction with rupee support"""
    try:
        predictor = request.app.state.predictor
        
        # Check if predictor is a ModelPredictor object
        if hasattr(predictor, 'predict'):
            result = predictor.predict(req.text, req.amount)
            return {
                'success': True,
                'prediction': result,
                'currency': 'INR'
            }
        # Check if predictor is a bound method (backward compatibility)
        elif hasattr(predictor, '__self__') and hasattr(predictor.__self__, 'predict'):
            result = predictor.__self__.predict(req.text, req.amount)
            return {
                'success': True,
                'prediction': result,
                'currency': 'INR'
            }
        else:
            # Import enhanced dummy predictor
            from models.model_dummy_loader import dummy_predict_enhanced
            result = dummy_predict_enhanced(req.text, req.amount)
            return {
                'success': True,
                'prediction': result,
                'currency': 'INR'
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.post('/predict/batch')
async def batch_predict(req: BatchPredictRequest, request: Request):
    """Enhanced batch prediction"""
    try:
        predictor = request.app.state.predictor
        
        # Check if predictor is a ModelPredictor object
        if hasattr(predictor, 'batch_predict'):
            results = predictor.batch_predict(req.transactions)
            return {
                'success': True,
                'predictions': results,
                'total_transactions': len(results),
                'currency': 'INR'
            }
        # Check if predictor is a bound method (backward compatibility)
        elif hasattr(predictor, '__self__') and hasattr(predictor.__self__, 'batch_predict'):
            results = predictor.__self__.batch_predict(req.transactions)
            return {
                'success': True,
                'predictions': results,
                'total_transactions': len(results),
                'currency': 'INR'
            }
        else:
            # Fallback batch processing
            results = []
            for transaction in req.transactions:
                text = transaction.get('text', transaction.get('description', ''))
                cat, conf = predictor(text)
                result = {
                    **transaction,
                    'category': cat,
                    'category_confidence': conf,
                    'model_version': 'fallback'
                }
                results.append(result)
            
            return {
                'success': True,
                'predictions': results,
                'total_transactions': len(results),
                'currency': 'INR'
            }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

@router.post('/insights')
async def get_spending_insights(req: InsightsRequest, request: Request):
    """Generate spending insights from transactions"""
    try:
        predictor = request.app.state.predictor
        
        if hasattr(predictor, '__self__') and hasattr(predictor.__self__, 'get_spending_insights'):
            insights = predictor.__self__.get_spending_insights(req.transactions)
            return {
                'success': True,
                'insights': insights,
                'currency': 'INR'
            }
        else:
            # Basic insights fallback
            total_amount = sum(t.get('amount', 0) for t in req.transactions)
            return {
                'success': True,
                'insights': {
                    'total_transactions': len(req.transactions),
                    'total_amount': total_amount,
                    'total_amount_formatted': f"₹{total_amount:,.0f}",
                    'average_transaction': total_amount / len(req.transactions) if req.transactions else 0,
                    'model_version': 'basic'
                },
                'currency': 'INR'
            }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Insights generation failed: {str(e)}")

@router.get('/predict/test')
async def test_enhanced_prediction(request: Request):
    """Test enhanced ML models with Indian transactions"""
    test_cases = [
        {"text": "Starbucks Coffee Day purchase", "amount": 450},
        {"text": "Amazon Flipkart shopping", "amount": 7500},
        {"text": "Suspicious unknown UPI payment", "amount": 25000},
        {"text": "HDFC Bank EMI payment", "amount": 155000},
        {"text": "Netflix Hotstar subscription", "amount": 1300},
        {"text": "Big Bazaar grocery shopping", "amount": 10500},
        {"text": "Shell HP petrol pump", "amount": 3800},
        {"text": "Fake subscription charge", "amount": 2500}
    ]
    
    results = []
    predictor = request.app.state.predictor
    
    for case in test_cases:
        try:
            if hasattr(predictor, '__self__') and hasattr(predictor.__self__, 'predict'):
                result = predictor.__self__.predict(case['text'], case['amount'])
                results.append({
                    'input': case,
                    'prediction': result,
                    'status': 'success'
                })
            else:
                cat, conf = predictor(case['text'])
                results.append({
                    'input': case,
                    'prediction': {
                        'category': cat,
                        'category_confidence': conf,
                        'amount_formatted': f"₹{case['amount']:,.0f}"
                    },
                    'status': 'fallback'
                })
        except Exception as e:
            results.append({
                'input': case,
                'error': str(e),
                'status': 'error'
            })
    
    return {
        'test_results': results,
        'currency': 'INR',
        'model_status': 'enhanced' if hasattr(predictor, '__self__') else 'basic'
    }

@router.get('/model/status')
async def get_model_status(request: Request):
    """Get current model status and capabilities"""
    try:
        predictor = request.app.state.predictor
        
        status = {
            'currency': 'INR',
            'enhanced_features': False,
            'fraud_detection': False,
            'batch_processing': False,
            'insights_generation': False
        }
        
        if hasattr(predictor, '__self__'):
            pred_obj = predictor.__self__
            status.update({
                'enhanced_features': hasattr(pred_obj, 'predict'),
                'fraud_detection': hasattr(pred_obj, 'fraud_pipeline') and pred_obj.fraud_pipeline is not None,
                'batch_processing': hasattr(pred_obj, 'batch_predict'),
                'insights_generation': hasattr(pred_obj, 'get_spending_insights'),
                'category_model': hasattr(pred_obj, 'cat_model') and pred_obj.cat_model is not None,
                'vectorizer': hasattr(pred_obj, 'vectorizer') and pred_obj.vectorizer is not None
            })
        
        return status
        
    except Exception as e:
        return {
            'error': str(e),
            'currency': 'INR',
            'enhanced_features': False
        }