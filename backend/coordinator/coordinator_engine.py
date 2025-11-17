from typing import List, Dict, Any
from agents.spending_agent import SpendingAgent
from agents.risk_agent import RiskAgent
from agents.behaviour_agent import BehaviourAgent

class CoordinatorEngine:
    def __init__(self, predictor, db_session=None):
        self.spending = SpendingAgent(predictor)
        self.risk = RiskAgent()
        self.behaviour = BehaviourAgent()
        self.db = db_session

    def run_full_analysis(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        # 1. Categorise
        categorized = [self.spending.categorize_transaction(t) for t in transactions]
        # 2. Monthly summary
        summary = self.spending.get_monthly_summary(categorized)
        # 3. Forecast
        forecast = self.spending.forecast_cashflow(categorized)
        # 4. Anomalies
        anomalies = self.spending.detect_anomalies(categorized)
        # 5. Risk
        risk = self.risk.predict_cashflow_gap(categorized)
        stress = self.risk.stress_score(risk)
        # 6. Behaviour
        profile = self.behaviour.infer_profile(categorized)
        trends = self.behaviour.detect_trends(categorized)
        # 7. Aggregate
        return {
            'summary': summary,
            'forecast': forecast,
            'anomalies': anomalies,
            'risk': risk,
            'stress_score': stress,
            'profile': profile,
            'trends': trends,
            'categorized_transactions': categorized
        }

    def delegate_to_agent(self, agent_name: str, *args, **kwargs):
        if agent_name == 'spending':
            return getattr(self.spending, kwargs.get('action'))(*args)
        if agent_name == 'risk':
            return getattr(self.risk, kwargs.get('action'))(*args)
        if agent_name == 'behaviour':
            return getattr(self.behaviour, kwargs.get('action'))(*args)
        raise ValueError('Unknown agent')