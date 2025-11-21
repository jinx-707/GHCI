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
        const result = await apiService.getTransactions();
        if (result.transactions && result.transactions.length > 0) {
          const liveTransactions = result.transactions.map((item) => ({
            id: item.id,
            text: item.description,
            amount: item.amount,
            category: item.category,
            confidence: item.confidence || 0,
            method: item.method,
            date: item.date
          }));
          setTransactions(liveTransactions);
          setIsLive(true);
        } else {
          // Show sample data when no transactions
          setTransactions([
            { id: 1, text: 'No transactions yet', amount: 0, category: 'Upload CSV to see data', date: new Date().toISOString().split('T')[0] }
          ]);
          setIsLive(true); // Backend is connected, just no data
        }
      } catch (error) {
        console.error('Live data failed:', error);
        // Set realistic demo transactions for offline mode
        setTransactions([
          { id: 1, text: 'Starbucks Coffee Day', amount: 450, category: 'Dining', confidence: 0.95, date: '2024-01-20' },
          { id: 2, text: 'Amazon Shopping', amount: 7500, category: 'Shopping', confidence: 0.88, date: '2024-01-19' },
          { id: 3, text: 'Uber Ride', amount: 280, category: 'Transportation', confidence: 0.92, date: '2024-01-19' },
          { id: 4, text: 'Big Bazaar Groceries', amount: 3200, category: 'Groceries', confidence: 0.85, date: '2024-01-18' },
          { id: 5, text: 'Netflix Subscription', amount: 799, category: 'Entertainment', confidence: 0.98, date: '2024-01-18' }
        ]);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 10000);
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
          background: isLive ? colors.success + "20" : colors.warning + "20",
          color: isLive ? colors.success : colors.warning,
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 600,
        }}>
          {isLive ? 'LIVE DATA' : 'DEMO DATA'}
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