import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "../context/ThemeContext";

const COLORS_LIGHT = ["#f97316", "#f59e0b", "#60a5fa", "#a78bfa"];
const COLORS_DARK = ["#fb923c", "#f59e0b", "#60a5fa", "#a78bfa"];

const SpendingPieChart = () => {
  const { theme } = useTheme();
  const data = [
    { name: "Dining", value: 250 },
    { name: "Shopping", value: 400 },
    { name: "Transport", value: 150 },
    { name: "Groceries", value: 350 },
  ];

  const colors = theme === "light" ? COLORS_LIGHT : COLORS_DARK;

  return (
    <div style={{
      background: theme === "light" ? "white" : "rgba(255,255,255,0.04)",
      padding: 18, borderRadius: 16, border: theme === "light" ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)"
    }}>
      <h4 style={{ marginTop: 0 }}>Spending Breakdown</h4>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingPieChart;
