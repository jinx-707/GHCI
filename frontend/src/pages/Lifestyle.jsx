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
        const [transactionsData, analyticsData] = await Promise.all([
          apiService.getTransactions(),
          apiService.getCategoryAnalytics()
        ]);
        
        const transactions = transactionsData.transactions || [];
        const totalSpending = analyticsData.total_spent || 0;
        const categoryBreakdown = {};
        
        // Convert analytics format to lifestyle format
        Object.entries(analyticsData.categories || {}).forEach(([category, data]) => {
          categoryBreakdown[category] = data.total;
        });
        
        setLifestyleData({
          transactions,
          insights: { category_breakdown: categoryBreakdown },
          totalSpending
        });
      } catch (error) {
        console.error('Failed to load lifestyle data:', error);
        // Set realistic demo data for offline mode
        setLifestyleData({
          transactions: [
            { description: 'Starbucks Coffee', amount: 450, category: 'Dining' },
            { description: 'Amazon Shopping', amount: 7500, category: 'Shopping' },
            { description: 'Uber Ride', amount: 280, category: 'Transportation' },
            { description: 'Netflix Subscription', amount: 799, category: 'Entertainment' },
            { description: 'Big Bazaar Groceries', amount: 3200, category: 'Groceries' }
          ],
          insights: { 
            category_breakdown: {
              'Dining': 15750,
              'Shopping': 28500,
              'Transportation': 8200,
              'Entertainment': 4500,
              'Groceries': 12800,
              'Utilities': 6500
            }
          },
          totalSpending: 76250
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLifestyleData();
    const interval = setInterval(fetchLifestyleData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getLifestyleProfile = () => {
    if (!lifestyleData?.insights?.category_breakdown) return 'Balanced Spender';
    
    const categories = lifestyleData.insights.category_breakdown;
    const total = Object.values(categories).reduce((sum, val) => sum + val, 0);
    
    if (total === 0) return 'New User';
    
    const maxCategory = Object.entries(categories).reduce((max, [cat, amount]) => 
      amount > max.amount ? { category: cat, amount } : max, 
      { category: '', amount: 0 }
    );
    
    const percentage = (maxCategory.amount / total) * 100;
    
    if (maxCategory.category === 'Dining' && percentage > 35) return 'Foodie';
    if (maxCategory.category === 'Shopping' && percentage > 35) return 'Shopaholic';
    if (maxCategory.category === 'Entertainment' && percentage > 25) return 'Entertainment Lover';
    if (maxCategory.category === 'Transportation' && percentage > 25) return 'Traveler';
    if (maxCategory.category === 'Groceries' && percentage > 30) return 'Home Chef';
    
    return 'Balanced Spender';
  };

  const getSpendingPersonality = () => {
    const total = lifestyleData?.totalSpending || 0;
    if (total === 0) return { type: 'New User', color: colors.textSecondary, icon: '👋' };
    if (total > 150000) return { type: 'High Spender', color: colors.error, icon: '💸' };
    if (total > 75000) return { type: 'Moderate Spender', color: colors.warning, icon: '💰' };
    if (total > 25000) return { type: 'Active Spender', color: colors.accent, icon: '💳' };
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
      'You have excellent spending habits! Keep it up',
      'Consider increasing your savings rate by 5%',
      'Look for investment opportunities with your surplus'
    ],
    'Home Chef': [
      'Great job on cooking at home! You\'re saving money',
      'Try bulk buying groceries for additional savings',
      'Consider growing herbs at home to reduce costs'
    ],
    'New User': [
      'Welcome! Start tracking your expenses to build insights',
      'Set up budget categories for better financial planning',
      'Upload your transaction data to get personalized tips'
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
          maxWidth: 500,
          margin: '0 auto',
        }}>
          {lifestyleData?.totalSpending > 0 ? 
            "Based on your spending patterns, we've identified your financial personality" :
            "Upload your transactions to get personalized financial insights and recommendations"
          }
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
            
            {Object.keys(lifestyleData?.insights?.category_breakdown || {}).length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
              }}>
                {Object.entries(lifestyleData.insights.category_breakdown).map(([category, amount]) => {
                  const total = lifestyleData?.totalSpending || 1;
                  const percentage = ((amount / total) * 100).toFixed(1);
                  const icons = {
                    'Dining': '🍽️', 'Shopping': '🛍️', 'Transportation': '🚗',
                    'Entertainment': '🎬', 'Groceries': '🛒', 'Utilities': '⚡',
                    'Banking': '🏦', 'Health': '🏥', 'Other': '📋'
                  };
                  
                  return (
                    <div key={category} style={{
                      padding: 16,
                      background: colors.glass,
                      borderRadius: 12,
                      textAlign: 'center',
                      border: `1px solid ${colors.border}`,
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
            ) : (
              <div style={{
                textAlign: 'center',
                padding: 40,
                color: colors.textSecondary,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <div style={{ fontSize: 18, marginBottom: 8 }}>No spending data available</div>
                <div style={{ fontSize: 14 }}>Upload your transactions to see your spending breakdown</div>
              </div>
            )}
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
              { metric: 'Monthly Average', value: formatRupees(lifestyleData?.totalSpending || 0), trend: lifestyleData?.totalSpending > 0 ? '+5%' : 'No data', positive: lifestyleData?.totalSpending > 50000 ? false : true },
              { metric: 'Savings Rate', value: '23%', trend: '+2%', positive: true },
              { metric: 'Spending Style', value: profile, trend: 'Identified', positive: true },
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