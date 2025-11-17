from typing import List, Dict, Any

class BatchInference:
    def __init__(self, predictor, db):
        self.predictor = predictor
        self.db = db

    def run_batch(self, transactions: List[Dict[str, Any]]):
        res = []
        for t in transactions:
            text = t.get('merchant_name') or t.get('description') or ''
            try:
                cat, conf = self.predictor(text)
            except Exception:
                from models.model_dummy_loader import dummy_predict
                cat, conf = dummy_predict(text)
            t['predicted_category'] = cat
            t['confidence'] = conf
            res.append(t)
        # save to DB in bulk if DB.available
        try:
            sess = self.db.get_session()
            from db.orm_models import Transaction
            for t in res:
                tr = Transaction(
                    transaction_id=t.get('transaction_id'),
                    merchant_name=t.get('merchant_name'),
                    description=t.get('description'),
                    amount=t.get('amount'),
                    date=t.get('date'),
                    type=t.get('type'),
                    predicted_category=t.get('predicted_category'),
                    confidence=t.get('confidence')
                )
                sess.add(tr)
            sess.commit()
        except Exception:
            pass
        return res
