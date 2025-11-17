import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "../context/ThemeContext";

const SpendingPieChart = ({ data }) => {
  const { theme } = useTheme();
  const chartData = data || [
    { name: "Dining", value: 3200 },
    { name: "Shopping", value: 4500 },
    { name: "Transport", value: 1600 },
    { name: "Entertainment", value: 1200 },
  ];

  const colors =
    theme === "light"
      ? ["#d8b4fe", "#fbcfe8", "#fde68a", "#ffd6a5"]
      : ["#7c3aed", "#c084fc", "#f59e0b", "#fb923c"];

  const cardStyle = {
    background:
      theme === "light"
        ? "linear-gradient(135deg, #f3e8ff, #e9d5ff)"
        : "linear-gradient(135deg, #6d28d9, #a855f7)",
    borderRadius: 24,
    padding: 22,
    color: theme === "light" ? "#1e293b" : "white",
    boxShadow:
      theme === "light"
        ? "0 8px 30px rgba(16,24,40,0.04)"
        : "0 8px 30px rgba(0,0,0,0.45)",
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Spending Breakdown</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>This month</div>
        </div>
        <div style={{ fontSize: 20 }}>📊</div>
      </div>

      <div style={{ width: "100%", height: 240, marginTop: 12 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={6}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: theme === "light" ? "white" : "#0f172a",
                borderRadius: 10,
                border: "none",
                color: theme === "light" ? "#1e293b" : "white",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingPieChart;
