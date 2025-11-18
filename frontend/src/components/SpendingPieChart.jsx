import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "../context/ThemeContext";

const data = [
  { name: 'Dining', value: 400 },
  { name: 'Shopping', value: 300 },
  { name: 'Utilities', value: 200 },
  { name: 'Fuel', value: 100 }
];

const COLORS_LIGHT = ['#f97316', '#7c3aed', '#3b82f6', '#10b981'];

const SpendingPieChart = () => {
  const { theme, accent } = useTheme();
  const colors = COLORS_LIGHT;
  return (
    <div style={{ padding: 16, borderRadius: 16, background: "var(--card-bg)", height: 260 }}>
      <div style={{ fontWeight: 800 }}>Spending Breakdown</div>
      <div style={{ height: 180, marginTop: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={40} outerRadius={70} paddingAngle={6}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 1 ? accent : colors[index % colors.length]} />
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
