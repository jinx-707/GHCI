import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { formatRupees } from "../utils/currency";
import apiService from "../services/api";

const Lifestyle = () => {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [activeTab, setActiveTab] = useState('spending');
  const [lifestyleData, setLifestyleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLifestyleData = async () => {
      try {
        const testData = await apiService.getTestData();
        if (testData.test_results) {
          const transactions = testData.test_results.map(item => ({
            text: item.input?.text || '',
            amount: item.input?.amount || 0,
            category: item.prediction?.category || 'Other',
            fraud_risk: item.prediction?.fraud_risk_level || 'LOW'
          }));
          
          const insights = await apiService.getInsights(transactions);
          setLifestyleData({
            transactions,
            insights: insights.insights,
            totalSpending: insights.insights?.total_amount || 0
          });
        }
      } catch (error) {
        console.error('Failed to load lifestyle data:', error);
        setLifestyleData({
          transactions: [],
          insights: { category_breakdown: {} },
          totalSpending: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLifestyleData();
    const interval = setInterval(fetchLifestyleData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const getLifestyleProfile = () => {
    if (!lifestyleData?.insights?.category_breakdown) return 'Balanced';
    
    const categories = lifestyleData.insights.category_breakdown;
    const total = Object.values(categories).reduce((sum, val) => sum + val, 0);
    
    if (categories.Dining > total * 0.4) return 'Foodie';
    if (categories.Shopping > total * 0.4) return 'Shopaholic';
    if (categories.Entertainment > total * 0.3) return 'Entertainment Lover';
    if (categories.Transportation > total * 0.3) return 'Traveler';
    return 'Balanced Spender';
  };

  const getSpendingPersonality = () => {
    const total = lifestyleData?.totalSpending || 0;
    if (total > 200000) return { type: 'High Spender', color: colors.error, icon: '💸' };
    if (total > 100000) return { type: 'Moderate Spender', color: colors.warning, icon: '💰' };
    return { type: 'Conservative Spender', color: colors.success, icon: '🏦' };
  };

  const lifestyleTips = {
    'Foodie': [
      'Try cooking at home 2-3 times a week to save ₹8K monthly',
      'Use food delivery apps with discounts and offers',
      'Explore local street food for budget-friendly options'
    ],
    'Shopaholic': [
      'Set a monthly shopping budget and stick to it',
      'Wait 24 hours before making non-essential purchases',
      'Use cashback apps and compare prices online'
    ],
    'Entertainment Lover': [
      'Look for group discounts on movie tickets and events',
      'Consider annual subscriptions instead of monthly ones',
      'Explore free entertainment options in your city'
    ],
    'Balanced Spender': [
      'You have good spending habits! Keep it up',
      'Consider increasing your savings rate by 5%',
      'Look for investment opportunities with your surplus'
    ]
  };

  if (loading) {
    return (
      <div className="fadeIn" style={{ display: "grid", gap: 24 }}>
        <div className="card" style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          textAlign: 'center',
          padding: 40,
        }}>
          <div style={{ color: colors.textSecondary }}>🔄 Analyzing your lifestyle...</div>
        </div>
      </div>
    );
  }

  const profile = getLifestyleProfile();
  const personality = getSpendingPersonality();
  const tips = lifestyleTips[profile] || lifestyleTips['Balanced Spender'];

  return (
    <div className="fadeIn" style={{ display: "grid", gap: 24 }}>
      {/* Lifestyle Profile Header */}
      <div className="card" style={{
        background: `linear-gradient(135deg, ${colors.accent}20, ${colors.success}20)`,
        border: `1px solid ${colors.border}`,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 48,
          marginBottom: 16,
        }}>
          {personality.icon}
        </div>
        <h2 style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 800,
          color: colors.text,
          marginBottom: 8,
        }}>
          You're a {profile}
        </h2>
        <div style={{
          fontSize: 18,
          color: personality.color,
          fontWeight: 600,
          marginBottom: 16,
        }}>
          {personality.type} • {formatRupees(lifestyleData?.totalSpending || 0)} monthly
        </div>
        <div style={{
          fontSize: 14,
          color: colors.textSecondary,
          maxWidth: 400,
          margin: '0 auto',
        }}>
          Based on your spending patterns, we've identified your financial personality
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: "flex",
        gap: 8,
        background: colors.glass,
        padding: 8,
        borderRadius: 12,
        border: `1px solid ${colors.border}`,
      }}>
        {[
          { id: 'spending', label: 'Spending Habits', icon: '💳' },
          { id: 'goals', label: 'Lifestyle Goals', icon: '🎯' },
          { id: 'tips', label: 'Smart Tips', icon: '💡' },
          { id: 'trends', label: 'Trends', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: 12,
              background: activeTab === tab.id ? colors.accent : 'transparent',
              color: activeTab === tab.id ? 'white' : colors.text,
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'spending' && (
        <div style={{ display: "grid", gap: 24 }}>
          {/* Spending Breakdown */}
          <div className="card" style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
          }}>
            <h3 style={{
              margin: "0 0 20px 0",
              fontSize: 18,
              fontWeight: 700,
              color: colors.text,
            }}>
              💳 Your Spending DNA
            </h3>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}>
              {Object.entries(lifestyleData?.insights?.category_breakdown || {}).map(([category, amount]) => {
                const total = lifestyleData?.totalSpending || 1;
                const percentage = ((amount / total) * 100).toFixed(1);
                const icons = {
                  'Dining': '🍽️', 'Shopping': '🛍️', 'Transportation': '🚗',
                  'Entertainment': '🎬', 'Groceries': '🛒', 'Utilities': '⚡'
                };
                
                return (
                  <div key={category} style={{
                    padding: 16,
                    background: colors.glass,
                    borderRadius: 12,
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>
                      {icons[category] || '📋'}
                    </div>
                    <div style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: colors.accent,
                      marginBottom: 4,
                    }}>
                      {formatRupees(amount)}
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: colors.text,
                      fontWeight: 600,
                      marginBottom: 4,
                    }}>
                      {category}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: colors.textSecondary,
                    }}>
                      {percentage}% of spending
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div style={{ display: "grid", gap: 24 }}>
          <div className="card" style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
          }}>
            <h3 style={{
              margin: "0 0 20px 0",
              fontSize: 18,
              fontWeight: 700,
              color: colors.text,
            }}>
              🎯 Lifestyle Goals
            </h3>
            
            <div style={{
              display: "grid",
              gap: 16,
            }}>
              {[
                { goal: 'Emergency Fund', target: 500000, current: 315000, icon: '🛡️' },
                { goal: 'Vacation Fund', target: 200000, current: 45000, icon: '✈️' },
                { goal: 'Gadget Upgrade', target: 150000, current: 89000, icon: '📱' },
                { goal: 'Health & Fitness', target: 100000, current: 25000, icon: '💪' }
              ].map((item, index) => {
                const progress = (item.current / item.target) * 100;
                
                return (
                  <div key={index} style={{
                    padding: 16,
                    background: colors.glass,
                    borderRadius: 12,
                    border: `1px solid ${colors.border}`,
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}>
                        <span style={{ fontSize: 24 }}>{item.icon}</span>
                        <div>
                          <div style={{
                            fontWeight: 600,
                            color: colors.text,
                          }}>
                            {item.goal}
                          </div>
                          <div style={{
                            fontSize: 12,
                            color: colors.textSecondary,
                          }}>
                            {formatRupees(item.current)} / {formatRupees(item.target)}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: colors.accent,
                      }}>
                        {progress.toFixed(0)}%
                      </div>
                    </div>
                    
                    <div style={{
                      height: 6,
                      background: colors.border,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${Math.min(progress, 100)}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentHover})`,
                        transition: "width 0.3s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="card" style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
        }}>
          <h3 style={{
            margin: "0 0 20px 0",
            fontSize: 18,
            fontWeight: 700,
            color: colors.text,
          }}>
            💡 Personalized Tips for {profile}
          </h3>
          
          <div style={{
            display: "grid",
            gap: 16,
          }}>
            {tips.map((tip, index) => (
              <div key={index} style={{
                padding: 16,
                background: colors.glass,
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: colors.accent + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  color: colors.accent,
                }}>
                  {index + 1}
                </div>
                <div style={{
                  fontSize: 16,
                  color: colors.text,
                  lineHeight: 1.5,
                }}>
                  {tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="card" style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
        }}>
          <h3 style={{
            margin: "0 0 20px 0",
            fontSize: 18,
            fontWeight: 700,
            color: colors.text,
          }}>
            📈 Your Spending Trends
          </h3>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 16,
          }}>
            {[
              { metric: 'Monthly Average', value: formatRupees(lifestyleData?.totalSpending || 0), trend: '+5%', positive: false },
              { metric: 'Savings Rate', value: '23%', trend: '+2%', positive: true },
              { metric: 'Largest Category', value: profile, trend: 'Stable', positive: true },
              { metric: 'Risk Score', value: 'Low', trend: 'Improving', positive: true }
            ].map((item, index) => (
              <div key={index} style={{
                padding: 16,
                background: colors.glass,
                borderRadius: 12,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 8,
                }}>
                  {item.value}
                </div>
                <div style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  marginBottom: 8,
                }}>
                  {item.metric}
                </div>
                <div style={{
                  fontSize: 12,
                  color: item.positive ? colors.success : colors.error,
                  fontWeight: 600,
                }}>
                  {item.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Lifestyle;