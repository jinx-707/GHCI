from typing import List, Dict, Any
from sklearn.cluster import KMeans
import numpy as np

class BehaviourAgent:
    def __init__(self):
        pass

    def infer_profile(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        # Very small unsupervised cluster on category spends to classify behaviour
        # For prototype: compute simple heuristics
        by_cat = {}
        for t in transactions:
            cat = t.get('predicted_category') or t.get('category') or 'Unknown'
            by_cat[cat] = by_cat.get(cat, 0.0) + abs(float(t.get('amount',0)))
        # Find top category
        if not by_cat:
            return {'profile': 'Unknown', 'top_categories': []}
        sorted_cats = sorted(by_cat.items(), key=lambda x: x[1], reverse=True)
        top = [c for c,_ in sorted_cats[:3]]
        total = sum(by_cat.values())
        impulsive_score = 0.0
        if 'Shopping' in by_cat and (by_cat['Shopping']/total) > 0.3:
            impulsive_score = 0.7
        profile = 'Budget-conscious'
        if impulsive_score > 0.5:
            profile = 'Impulsive'
        elif 'Dining' in by_cat and (by_cat['Dining']/total) > 0.25:
            profile = 'Social Spender'
        return {'profile': profile, 'top_categories': top, 'impulsive_score': impulsive_score}

    def detect_trends(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        # Simple month-to-month trend detection per category
        trends = {}
        # Expect date in YYYY-MM-DD
        per_month_cat = {}
        for t in transactions:
            date = t.get('date','')[:7] if t.get('date') else 'unknown'
            cat = t.get('predicted_category') or t.get('category') or 'Unknown'
            per_month_cat.setdefault((date,cat), 0.0)
            per_month_cat[(date,cat)] += abs(float(t.get('amount',0)))
        # produce trend lines for top categories
        return {'trends_sample': dict(list(per_month_cat.items())[:10])}