import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { formatRupees } from "../utils/currency";
import apiService from "../services/api";

const RecentTransactions = () => {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const result = await apiService.getTestData();
        if (result.test_results) {
          const liveTransactions = result.test_results.map((item, index) => ({
            id: index + 1,
            text: item.input?.text || 'Unknown Transaction',
            amount: item.input?.amount || 0,
            category: item.prediction?.category || 'Other',
            confidence: item.prediction?.category_confidence || 0,
            fraud_risk: item.prediction?.fraud_risk_level || 'LOW',
            fraud_prob: item.prediction?.fraud_probability || 0,
            date: new Date().toISOString().split('T')[0]
          }));
          setTransactions(liveTransactions);
          setIsLive(true);
        }
      } catch (error) {
        console.error('Live data failed:', error);
        setTransactions([
          { id: 1, text: 'Backend Offline', amount: 0, category: 'Error', date: new Date().toISOString().split('T')[0] }
        ]);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      'Dining': '🍽️', 'Shopping': '🛍️', 'Transportation': '🚗',
      'Groceries': '🛒', 'Utilities': '⚡', 'Entertainment': '🎬',
      'Housing': '🏠', 'Health': '🏥', 'Education': '📚', 'Other': '📋'
    };
    return icons[category] || '📋';
  };

  if (loading) {
    return (
      <div className="card" style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        textAlign: 'center', padding: 40,
      }}>
        <div style={{ color: colors.textSecondary }}>🔄 Connecting to live backend...</div>
      </div>
    );
  }

  return (
    <div className="card" style={{
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          color: colors.text,
        }}>
          {isLive ? '🔴 LIVE' : '⚫ OFFLINE'} Transactions
        </h3>
        <div style={{
          padding: "4px 8px",
          background: isLive ? colors.success + "20" : colors.error + "20",
          color: isLive ? colors.success : colors.error,
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 600,
        }}>
          {isLive ? 'BACKEND CONNECTED' : 'BACKEND OFFLINE'}
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {transactions.slice(0, 5).map((transaction) => (
          <div key={transaction.id} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            borderRadius: 12,
            background: colors.glass,
            border: `1px solid ${colors.border}`,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: colors.accent + "20",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}>
                {getCategoryIcon(transaction.category)}
              </div>
              <div>
                <div style={{
                  fontWeight: 600,
                  color: colors.text,
                  fontSize: 14,
                }}>
                  {transaction.text}
                </div>
                <div style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <span>{transaction.category}</span>
                  {transaction.confidence && (
                    <>
                      <span>•</span>
                      <span>{(transaction.confidence * 100).toFixed(0)}%</span>
                    </>
                  )}
                  {transaction.fraud_risk && transaction.fraud_risk !== 'LOW' && (
                    <>
                      <span>•</span>
                      <span style={{ color: colors.error }}>{transaction.fraud_risk}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: colors.text,
              }}>
                {formatRupees(transaction.amount)}
              </div>
              {transaction.fraud_prob > 0.5 && (
                <div style={{
                  fontSize: 10,
                  color: colors.error,
                  fontWeight: 600,
                }}>
                  FRAUD RISK
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;