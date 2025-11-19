import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { formatRupees } from "../utils/currency";
import apiService from "../services/api";

const SummaryCard = () => {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchLiveInsights = async () => {
      try {
        // Get test transactions first
        const testResult = await apiService.getTestData();
        if (testResult.test_results) {
          const transactions = testResult.test_results.map(item => ({
            text: item.input?.text || '',
            amount: item.input?.amount || 0,
            category: item.prediction?.category || 'Other'
          }));

          // Get insights from these transactions
          const insightsResult = await apiService.getInsights(transactions);
          if (insightsResult.insights) {
            setInsights(insightsResult.insights);
            setIsLive(true);
          }
        }
      } catch (error) {
        console.error('Live insights failed:', error);
        // Fallback data
        setInsights({
          total_amount: 0,
          category_breakdown: { 'Error': 0 },
          average_transaction: 0
        });
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveInsights();
    const interval = setInterval(fetchLiveInsights, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="card" style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        textAlign: 'center', padding: 40,
      }}>
        <div style={{ color: colors.textSecondary }}>🔄 Loading live insights...</div>
      </div>
    );
  }

  const totalSpent = insights?.total_amount || 0;
  const categories = insights?.category_breakdown || {};
  const topCategories = Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="card" style={{
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: colors.text,
          }}>
            {isLive ? '🔴 LIVE' : '⚫ OFFLINE'} Summary
          </h3>
          <p style={{
            margin: "4px 0 0 0",
            fontSize: 14,
            color: colors.textSecondary,
          }}>
            {isLive ? 'Real-time ML insights' : 'Backend disconnected'}
          </p>
        </div>
        <div style={{
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentHover})`,
          padding: "12px 20px",
          borderRadius: 12,
          color: "white",
          fontWeight: 800,
          fontSize: 18,
          boxShadow: colors.shadow,
        }}>
          {formatRupees(totalSpent)}
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {topCategories.length > 0 ? topCategories.map(([category, amount], index) => {
          const icons = {
            'Dining': '🍽️', 'Shopping': '🛍️', 'Transportation': '🚗',
            'Groceries': '🛒', 'Utilities': '⚡', 'Entertainment': '🎬',
            'Housing': '🏠', 'Health': '🏥', 'Education': '📚', 'Other': '📋'
          };
          
          return (
            <div key={category} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              background: colors.glass,
              borderRadius: 12,
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
                  fontSize: 18,
                }}>
                  {icons[category] || '📋'}
                </div>
                <div>
                  <div style={{
                    fontWeight: 600,
                    color: colors.text,
                    fontSize: 16,
                  }}>
                    {category}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                  }}>
                    {totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(1) : 0}% of total
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: 18,
                fontWeight: 700,
                color: colors.accent,
              }}>
                {formatRupees(amount)}
              </div>
            </div>
          );
        }) : (
          <div style={{
            textAlign: 'center',
            padding: 20,
            color: colors.textSecondary
          }}>
            {isLive ? 'No data available' : 'Connect to backend for live data'}
          </div>
        )}
      </div>

      <div style={{
        marginTop: 20,
        padding: 16,
        background: colors.glass,
        borderRadius: 12,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 14,
          color: colors.textSecondary,
          marginBottom: 4,
        }}>
          Average Transaction
        </div>
        <div style={{
          fontSize: 24,
          fontWeight: 800,
          color: colors.success,
        }}>
          {formatRupees(insights?.average_transaction || 0)}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;