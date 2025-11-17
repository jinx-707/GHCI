from typing import List, Dict, Any
import numpy as np
from collections import defaultdict

class SpendingAgent:
    """Responsible for categorisation orchestration, summaries and simple forecasting."""

    def __init__(self, predictor):
        # predictor: callable(text)->(category, confidence)
        self.predict = predictor

    def categorize_transaction(self, txn: Dict[str, Any]) -> Dict[str, Any]:
        text = txn.get('merchant_name') or txn.get('description') or ''
        category, confidence = self.predict(text)
        out = {**txn, 'predicted_category': category, 'confidence': float(confidence)}
        return out

    def get_monthly_summary(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        # transactions: list of {amount, predicted_category}
        summary = defaultdict(float)
        total = 0.0
        for t in transactions:
            amt = float(t.get('amount', 0.0))
            cat = t.get('predicted_category') or t.get('category') or 'Unknown'
            summary[cat] += amt
            total += amt
        return {'total_spent': total, 'by_category': dict(summary)}

    def forecast_cashflow(self, transactions: List[Dict[str, Any]], months: int = 3) -> Dict[str, Any]:
        # naive forecast: monthly average by category
        # expecting transactions that include 'date' and 'amount'
        # This is simple and meant to be replaced by more complex forecasting later.
        monthly = defaultdict(list)
        for t in transactions:
            # bucket by YYYY-MM
            date = t.get('date') or ''
            month = date[:7] if len(date) >= 7 else 'unknown'
            monthly[month].append(float(t.get('amount', 0.0)))
        if not monthly:
            return {'forecast': []}
        # average per month
        vals = [sum(v)/len(v) for v in monthly.values() if len(v) > 0]
        avg = float(np.mean(vals)) if vals else 0.0
        forecast = [{'month_offset': i+1, 'predicted_spending': round(avg,2)} for i in range(months)]
        return {'forecast': forecast}

    def detect_anomalies(self, transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        # Simple z-score anomaly detection over amounts
        amounts = [float(t.get('amount', 0.0)) for t in transactions]
        if len(amounts) < 2:
            return []
        arr = np.array(amounts)
        mean = arr.mean(); std = arr.std()
        anomalies = []
        for t, a in zip(transactions, amounts):
            if std > 0 and abs(a-mean) > 3*std:
                anomalies.append({**t, 'anomaly': True, 'z_score': float((a-mean)/std)})
        return anomalies