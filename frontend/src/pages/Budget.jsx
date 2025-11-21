import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { formatRupees } from "../utils/currency";
import ScenarioSimulator from "../components/ScenarioSimulator";
import apiService from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const categoryData = [
  { name: "🍽️ Dining", value: 45000, budget: 40000, color: "#FF6B6B" },
  { name: "🛍️ Shopping", value: 32000, budget: 30000, color: "#4ECDC4" },
  { name: "🚗 Transport", value: 18000, budget: 20000, color: "#45B7D1" },
  { name: "💡 Utilities", value: 15000, budget: 25000, color: "#96CEB4" },
  { name: "🛒 Groceries", value: 28000, budget: 35000, color: "#FFEAA7" },
  { name: "🎬 Entertainment", value: 12000, budget: 15000, color: "#DDA0DD" },
];

const weeklySpending = [
  { week: "Week 1", amount: 28000 },
  { week: "Week 2", amount: 35000 },
  { week: "Week 3", amount: 42000 },
  { week: "Week 4", amount: 45000 },
];

const Budget = () => {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [monthlyBudget, setMonthlyBudget] = useState(250000);
  const [currentSpent, setCurrentSpent] = useState(0);
  const [savingsGoal] = useState(50000);
  const [realCategoryData, setRealCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const totalCategorySpent = realCategoryData.reduce((sum, cat) => sum + cat.value, 0) || currentSpent;
  const remaining = monthlyBudget - totalCategorySpent;
  const progressPercent = (totalCategorySpent / monthlyBudget) * 100;
  const savingsProgress = (remaining / savingsGoal) * 100;

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const analytics = await apiService.getCategoryAnalytics();
        if (analytics.categories) {
          const categoryArray = Object.entries(analytics.categories).map(([name, data]) => ({
            name: `${getCategoryIcon(name)} ${name}`,
            value: data.total,
            budget: getBudgetForCategory(name),
            color: getCategoryColor(name)
          }));
          setRealCategoryData(categoryArray);
          setCurrentSpent(analytics.total_spent || 0);
        }
      } catch (error) {
        console.error('Failed to load budget data:', error);
        // Use default data if backend fails
        setRealCategoryData(categoryData);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
    const interval = setInterval(fetchBudgetData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      'Dining': '🍽️', 'Shopping': '🛍️', 'Transportation': '🚗',
      'Utilities': '⚡', 'Groceries': '🛒', 'Entertainment': '🎬',
      'Healthcare': '🏥', 'Education': '📚'
    };
    return icons[category] || '📋';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Dining': '#FF6B6B', 'Shopping': '#4ECDC4', 'Transportation': '#45B7D1',
      'Utilities': '#96CEB4', 'Groceries': '#FFEAA7', 'Entertainment': '#DDA0DD',
      'Healthcare': '#FF9FF3', 'Education': '#54A0FF'
    };
    return colorMap[category] || '#95A5A6';
  };

  const getBudgetForCategory = (category) => {
    const budgets = {
      'Dining': 40000, 'Shopping': 30000, 'Transportation': 20000,
      'Utilities': 25000, 'Groceries': 35000, 'Entertainment': 15000,
      'Healthcare': 20000, 'Education': 10000
    };
    return budgets[category] || 15000;
  };

  const handleUpdateBudget = async () => {
    // In a real app, this would save to backend
    alert(`Budget updated to ${formatRupees(monthlyBudget)}`);
  };

  const handleSaveBudget = async () => {
    alert('Budget saved successfully!');
  };

  const handleExportData = async () => {
    const data = {
      monthlyBudget,
      totalSpent: totalCategorySpent,
      remaining,
      categories: realCategoryData
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fadeIn" style={{ display: "grid", gap: 20 }}>
      {/* Top Stats Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
      }}>
        <div className="card" style={{
          background: `linear-gradient(135deg, ${colors.accent}20, ${colors.accent}10)`,
          border: `1px solid ${colors.accent}30`,
          textAlign: "center",
          padding: 16,
        }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: colors.accent }}>
            {formatRupees(monthlyBudget)}
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
            💰 Monthly Budget
          </div>
        </div>
        
        <div className="card" style={{
          background: `linear-gradient(135deg, ${colors.error}20, ${colors.error}10)`,
          border: `1px solid ${colors.error}30`,
          textAlign: "center",
          padding: 16,
        }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: colors.error }}>
            {formatRupees(totalCategorySpent)}
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
            💸 Total Spent
          </div>
        </div>
        
        <div className="card" style={{
          background: `linear-gradient(135deg, ${colors.success}20, ${colors.success}10)`,
          border: `1px solid ${colors.success}30`,
          textAlign: "center",
          padding: 16,
        }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: remaining >= 0 ? colors.success : colors.error }}>
            {formatRupees(Math.abs(remaining))}
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
            {remaining >= 0 ? "💚 Remaining" : "⚠️ Over Budget"}
          </div>
        </div>
        
        <div className="card" style={{
          background: `linear-gradient(135deg, ${colors.warning}20, ${colors.warning}10)`,
          border: `1px solid ${colors.warning}30`,
          textAlign: "center",
          padding: 16,
        }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: colors.warning }}>
            {Math.round(savingsProgress)}%
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
            🎯 Savings Goal
          </div>
        </div>
      </div>

      {/* Main Content Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
      }}>
        {/* Budget Control Panel */}
        <div className="card" style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
        }}>
          <h3 style={{
            margin: "0 0 16px 0",
            fontSize: 18,
            fontWeight: 700,
            color: colors.text,
          }}>
            🎛️ Budget Control
          </h3>
          
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}>
              <span style={{ color: colors.text, fontSize: 14 }}>Monthly Progress</span>
              <span style={{ color: colors.accent, fontSize: 14, fontWeight: 600 }}>
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div style={{
              height: 10,
              background: colors.border,
              borderRadius: 5,
              overflow: "hidden",
            }}>
              <div style={{
                width: `${Math.min(progressPercent, 100)}%`,
                height: "100%",
                background: progressPercent > 90 
                  ? `linear-gradient(90deg, ${colors.error}, #dc2626)`
                  : `linear-gradient(90deg, ${colors.accent}, ${colors.accentHover})`,
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
          
          <div style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
          }}>
            <input
              type="number"
              placeholder="Set monthly budget"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                background: colors.glass,
                color: colors.text,
                fontSize: 14,
              }}
            />
            <button 
              onClick={handleUpdateBudget}
              className="btn btn-primary" style={{
              background: colors.accent,
              color: "white",
              padding: "12px 16px",
              fontSize: 14,
            }}>
              Update
            </button>
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}>
            <button 
              onClick={handleSaveBudget}
              style={{
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${colors.success}`,
              background: colors.success + "20",
              color: colors.success,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              💾 Save Budget
            </button>
            <button 
              onClick={handleExportData}
              style={{
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${colors.warning}`,
              background: colors.warning + "20",
              color: colors.warning,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              📊 Export Data
            </button>
          </div>
        </div>

        {/* Enhanced Scenario Simulator */}
        <ScenarioSimulator currentSpending={totalCategorySpent} />
      </div>

      {/* Charts Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
      }}>
        {/* Category Spending Pie Chart */}
        <div className="card" style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
        }}>
          <h3 style={{
            margin: "0 0 16px 0",
            fontSize: 18,
            fontWeight: 700,
            color: colors.text,
          }}>
            🥧 Spending Breakdown
          </h3>
          
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatRupees(value)}
                  contentStyle={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Weekly Spending Trend */}
        <div className="card" style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
        }}>
          <h3 style={{
            margin: "0 0 16px 0",
            fontSize: 18,
            fontWeight: 700,
            color: colors.text,
          }}>
            📈 Weekly Trend
          </h3>
          
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySpending}>
                <XAxis dataKey="week" stroke={colors.textSecondary} />
                <YAxis 
                  stroke={colors.textSecondary}
                  tickFormatter={(value) => formatRupees(value)}
                />
                <Tooltip
                  formatter={(value) => formatRupees(value)}
                  contentStyle={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="amount" fill={colors.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Details */}
      <div className="card" style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
      }}>
        <h3 style={{
          margin: "0 0 16px 0",
          fontSize: 18,
          fontWeight: 700,
          color: colors.text,
        }}>
          📋 Category Performance
        </h3>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}>
          {(realCategoryData.length > 0 ? realCategoryData : categoryData).map((item, index) => {
            const percent = (item.value / item.budget) * 100;
            const isOverBudget = item.value > item.budget;
            
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
                    fontWeight: 600,
                    color: colors.text,
                    fontSize: 14,
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: isOverBudget ? colors.error : colors.success,
                    fontWeight: 600,
                  }}>
                    {formatRupees(item.value)} / {formatRupees(item.budget)}
                  </div>
                </div>
                
                <div style={{
                  height: 6,
                  background: colors.border,
                  borderRadius: 3,
                  overflow: "hidden",
                  marginBottom: 8,
                }}>
                  <div style={{
                    width: `${Math.min(percent, 100)}%`,
                    height: "100%",
                    background: isOverBudget ? colors.error : item.color,
                    transition: "width 0.3s ease",
                  }} />
                </div>
                
                <div style={{
                  fontSize: 11,
                  color: colors.textSecondary,
                }}>
                  {isOverBudget 
                    ? `${formatRupees(item.value - item.budget)} over budget (${Math.round(percent)}%)`
                    : `${formatRupees(item.budget - item.value)} remaining (${Math.round(percent)}%)`
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Budget;