from typing import List, Dict, Any

class AlertService:
    def __init__(self):
        self.alerts = []

    def check_budget(self, summary: Dict[str, Any], budgets: Dict[str, float]):
        # budgets: category -> limit
        flagged = []
        for cat, spent in summary.get('by_category', {}).items():
            limit = budgets.get(cat)
            if limit and spent > limit:
                flagged.append({'category': cat, 'spent': spent, 'limit': limit})
        return flagged

    def schedule_alert(self, msg: str):
        self.alerts.append({'message': msg})
        return True
