import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { formatRupees } from "../utils/currency";

const FeedbackSystem = () => {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [correcting, setCorrecting] = useState({});

  const categories = [
    "Dining", "Shopping", "Transportation", "Utilities", 
    "Groceries", "Entertainment", "Healthcare", "Education", "Other"
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await apiService.getTransactions();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const submitCorrection = async (transactionId, originalCategory, newCategory, confidence) => {
    setCorrecting(prev => ({ ...prev, [transactionId]: true }));
    
    try {
      const result = await apiService.submitFeedback({
        transaction_id: transactionId,
        original_category: originalCategory,
        corrected_category: newCategory,
        confidence: confidence
      });

      if (result) {
        // Update local state
        setTransactions(prev => 
          prev.map(txn => 
            txn.id === transactionId 
              ? { ...txn, category: newCategory, confidence: 0.95, method: "user_corrected" }
              : txn
          )
        );
      }
    } catch (error) {
      console.error('Error submitting correction:', error);
    } finally {
      setCorrecting(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.8) return colors.success;
    if (confidence > 0.5) return colors.warning;
    return colors.error;
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence > 0.8) return "High";
    if (confidence > 0.5) return "Medium";
    return "Low";
  };

  if (loading) {
    return (
      <div className="card" style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        padding: 20,
        textAlign: "center",
      }}>
        <div style={{ color: colors.text }}>Loading transactions...</div>
      </div>
    );
  }

  const lowConfidenceTransactions = transactions.filter(t => t.confidence < 0.7);

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
          🎯 AI Feedback System
        </h3>
        <div style={{
          padding: "6px 12px",
          background: colors.accent + "20",
          color: colors.accent,
          borderRadius: 16,
          fontSize: 12,
          fontWeight: 600,
        }}>
          {lowConfidenceTransactions.length} need review
        </div>
      </div>

      {lowConfidenceTransactions.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: 40,
          color: colors.textSecondary,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <div>All predictions look good!</div>
          <div style={{ fontSize: 14, marginTop: 8 }}>
            No low-confidence transactions to review
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {lowConfidenceTransactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} style={{
              padding: 16,
              background: colors.glass,
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 600,
                    color: colors.text,
                    marginBottom: 4,
                  }}>
                    {transaction.description}
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginBottom: 8,
                  }}>
                    {formatRupees(transaction.amount)} • {transaction.date}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    fontStyle: "italic",
                  }}>
                    {transaction.reasoning}
                  </div>
                </div>
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <div style={{
                    padding: "4px 8px",
                    background: getConfidenceColor(transaction.confidence) + "20",
                    color: getConfidenceColor(transaction.confidence),
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    {getConfidenceLabel(transaction.confidence)} ({Math.round(transaction.confidence * 100)}%)
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <span style={{
                    fontSize: 14,
                    color: colors.text,
                  }}>
                    Predicted:
                  </span>
                  <span style={{
                    padding: "4px 12px",
                    background: colors.accent + "20",
                    color: colors.accent,
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    {transaction.category}
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <select
                    defaultValue={transaction.category}
                    onChange={(e) => {
                      if (e.target.value !== transaction.category) {
                        submitCorrection(
                          transaction.id,
                          transaction.category,
                          e.target.value,
                          transaction.confidence
                        );
                      }
                    }}
                    disabled={correcting[transaction.id]}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: `1px solid ${colors.border}`,
                      background: colors.glass,
                      color: colors.text,
                      fontSize: 12,
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  
                  {correcting[transaction.id] && (
                    <div style={{
                      fontSize: 12,
                      color: colors.success,
                    }}>
                      ✅ Saved
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{
        marginTop: 16,
        padding: 12,
        background: colors.accent + "10",
        borderRadius: 8,
        fontSize: 12,
        color: colors.textSecondary,
      }}>
        💡 Your corrections help improve AI accuracy for future predictions
      </div>
    </div>
  );
};

export default FeedbackSystem;