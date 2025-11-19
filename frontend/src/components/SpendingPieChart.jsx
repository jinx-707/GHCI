import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "../context/ThemeContext";
import { formatRupees } from "../utils/currency";
import apiService from "../services/api";

const SpendingPieChart = () => {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [spendingData, setSpendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const chartColors = [
    colors.accent, colors.success, colors.warning, colors.error,
    '#8b5cf6', '#06b6d4', '#f43f5e'
  ];

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const testResult = await apiService.getTestData();
        if (testResult.test_results) {
          const transactions = testResult.test_results.map(item => ({
            text: item.input?.text || '',
            amount: item.input?.amount || 0,
            category: item.prediction?.category || 'Other'
          }));

          const insightsResult = await apiService.getInsights(transactions);
          if (insightsResult.insights?.category_breakdown) {
            const data = Object.entries(insightsResult.insights.category_breakdown)
              .map(([name, value]) => ({ name, value: Math.round(value) }))
              .filter(item => item.value > 0);
            setSpendingData(data);
            setIsLive(true);
          }
        }
      } catch (error) {
        console.error('Live chart data failed:', error);
        setSpendingData([{ name: 'No Data', value: 1 }]);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 12000); // Refresh every 12s
    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          padding: 12,
          boxShadow: colors.shadow,
        }}>
          <div style={{
            color: colors.text,
            fontWeight: 600,
            fontSize: 14,
          }}>
            {data.name}
          </div>
          <div style={{
            color: data.color,
            fontWeight: 700,
            fontSize: 16,
          }}>
            {formatRupees(data.value)}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card" style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        height: 320,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: colors.textSecondary }}>🔄 Loading live chart...</div>
      </div>
    );
  }

  const total = spendingData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="card" style={{
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      height: 320,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          color: colors.text,
        }}>
          {isLive ? '🔴 LIVE' : '⚫ OFFLINE'} Spending
        </h3>
        <div style={{
          fontSize: 12,
          color: colors.textSecondary,
          background: isLive ? colors.success + "20" : colors.error + "20",
          padding: "4px 8px",
          borderRadius: 6,
        }}>
          {isLive ? formatRupees(total) : 'No Data'}
        </div>
      </div>

      {spendingData.length > 0 && total > 0 ? (
        <>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {spendingData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 16,
          }}>
            {spendingData.map((item, index) => (
              <div key={item.name} style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
              }}>
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: chartColors[index % chartColors.length],
                }} />
                <span style={{ color: colors.text, fontWeight: 500 }}>
                  {item.name}
                </span>
                <span style={{ color: colors.textSecondary, marginLeft: 'auto' }}>
                  {formatRupees(item.value)}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.textSecondary
        }}>
          {isLive ? 'No spending data available' : 'Connect to backend for live data'}
        </div>
      )}
    </div>
  );
};

export default SpendingPieChart;