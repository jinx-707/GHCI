from typing import List, Dict, Any

class ScenarioSimulator:
    def __init__(self, coordinator):
        self.coordinator = coordinator

    def simulate_category_reduction(self, transactions: List[Dict[str, Any]], category: str, percent: float) -> Dict[str, Any]:
        # reduce all transactions in category by percent and re-run summary/forecast
        modified = []
        for t in transactions:
            new_t = dict(t)
            if (t.get('predicted_category') or t.get('category') or '').lower() == category.lower():
                try:
                    amt = float(t.get('amount',0.0))
                    new_t['amount'] = amt * (1 - percent/100.0)
                except Exception:
                    pass
            modified.append(new_t)
        return self.coordinator.run_full_analysis(modified)

    def simulate_income_change(self, transactions: List[Dict[str, Any]], delta: float) -> Dict[str, Any]:
        # apply delta to each credit proportionally
        modified = []
        for t in transactions:
            new_t = dict(t)
            if t.get('type') == 'credit':
                try:
                    new_t['amount'] = float(t.get('amount',0.0)) + delta
                except Exception:
                    pass
            modified.append(new_t)
        return self.coordinator.run_full_analysis(modified)

    def simulate_budget_allocation_change(self, transactions: List[Dict[str, Any]], from_cat: str, to_cat: str, amount: float) -> Dict[str, Any]:
        # move 'amount' from from_cat to to_cat by adjusting two synthetic transactions
        modified = list(transactions)
        # implement as synthetic adjustments
        adjustment_from = {'merchant_name': f'Move_from_{from_cat}', 'amount': -abs(amount), 'predicted_category': from_cat, 'type': 'debit'}
        adjustment_to = {'merchant_name': f'Move_to_{to_cat}', 'amount': abs(amount), 'predicted_category': to_cat, 'type': 'debit'}
        modified.append(adjustment_from)
        modified.append(adjustment_to)
        return self.coordinator.run_full_analysis(modified)