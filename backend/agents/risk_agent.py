from typing import List, Dict, Any

class RiskAgent:
    def __init__(self):
        pass

    def predict_cashflow_gap(self, transactions: List[Dict[str, Any]], threshold: float = 0.2) -> Dict[str, Any]:
        # simplistic risk: checks if upcoming month predicted spending > avg_income * (1 + threshold)
        incomes = [float(t['amount']) for t in transactions if t.get('type') == 'credit']
        expenses = [float(t['amount']) for t in transactions if t.get('type') == 'debit']
        total_income = sum(incomes) if incomes else 0.0
        avg_expense = (sum(expenses)/len(expenses)) if expenses else 0.0
        risk = 'low'
        reason = ''
        if total_income == 0 and avg_expense > 0:
            risk = 'high'
            reason = 'No recent income found but there are expenses.'
        elif total_income > 0 and avg_expense/total_income > (1 + threshold):
            risk = 'high'
            reason = f'expense to income ratio too high: {avg_expense/total_income:.2f}'
        elif total_income > 0 and avg_expense/total_income > 1.0:
            risk = 'medium'
            reason = 'monthly expenses slightly exceed income.'
        else:
            reason = 'income sufficient for recent expense levels.'
        return {'risk': risk, 'reason': reason, 'total_income': total_income, 'avg_expense': avg_expense}

    def stress_score(self, profile: Dict[str, Any]) -> float:
        # compute a normalized stress score 0-1 from simple heuristics
        risk = profile.get('risk', 'low')
        mapping = {'low': 0.1, 'medium': 0.5, 'high': 0.9}
        return mapping.get(risk, 0.1)