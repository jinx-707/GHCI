import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.testPrediction();
        const mockTransactions = result.test_results?.map((item, index) => ({
          id: index + 1,
          text: item.input?.text || '',
          amount: item.input?.amount || 0,
          category: item.prediction?.category || 'Other',
          confidence: item.prediction?.category_confidence || 0,
          fraud_risk: item.prediction?.fraud_risk_level || 'LOW',
          date: new Date().toISOString().split('T')[0]
        })) || [];
        setTransactions(mockTransactions);
      } catch (err) {
        setError(err.message);
        // Fallback data
        setTransactions([
          { id: 1, text: 'Starbucks Coffee', amount: 450, category: 'Dining', date: '2024-01-15' },
          { id: 2, text: 'Amazon Shopping', amount: 7500, category: 'Shopping', date: '2024-01-14' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { transactions, loading, error };
};

export const useInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const testData = [
          { text: 'Starbucks Coffee', amount: 450 },
          { text: 'Amazon Shopping', amount: 7500 },
          { text: 'HDFC EMI', amount: 155000 }
        ];
        const result = await apiService.getInsights(testData);
        setInsights(result.insights);
      } catch (err) {
        setInsights({
          total_amount: 125000,
          category_breakdown: {
            'Dining': 29800,
            'Shopping': 45600,
            'Transportation': 14500
          }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return { insights, loading };
};

export const usePrediction = () => {
  const [predict, setPredict] = useState(() => async (text, amount) => {
    try {
      const result = await apiService.predict(text, amount);
      return result.prediction;
    } catch (err) {
      return { category: 'Other', confidence: 0.5 };
    }
  });

  return predict;
};