import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const forecastData = [
  { month: "Jan", spent: 12000, forecast: 15000 },
  { month: "Feb", spent: 11000, forecast: 14000 },
  { month: "Mar", spent: 13000, forecast: 15500 },
  { month: "Apr", spent: 9000, forecast: 12000 },
  { month: "May", spent: 10000, forecast: 13000 },
  { month: "Jun", spent: 9500, forecast: 12500 }
];

const Budget = () => {
  const { theme } = useTheme();
  const [goal, setGoal] = useState(30000);
  const [spent, setSpent] = useState(18500);

  const [sim, setSim] = useState(0); // scenario %

  const predictedTotal = spent - (spent * sim) / 100;

  const card = {
    background: theme === "light" ? "#ffffff" : "rgba(255,255,255,0.06)",
    padding: 22,
    borderRadius: 20,
    boxShadow:
      theme === "light"
        ? "0 8px 28px rgba(16,24,40,0.05)"
        : "0 8px 28px rgba(0,0,0,0.45)"
  };

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <h2>💸 Budget Planner</h2>

      {/* DYNAMIC BUDGET GOAL */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <b>Budget Goal:</b> ₹{goal}
          </div>
          <div>
            <b>Spent:</b> ₹{spent}
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            height: 10,
            background: "rgba(0,0,0,0.1)",
            borderRadius: 20
          }}
        >
          <div
            style={{
              width: `${(spent / goal) * 100}%`,
              background:
                spent > goal ? "#ef4444" : "linear-gradient(90deg,#06b6d4,#3b82f6)",
              height: 10,
              borderRadius: 20
            }}
          ></div>
        </div>

        <div style={{ marginTop: 14 }}>
          <input
            type="number"
            placeholder="Set new budget"
            onChange={(e) => setGoal(Number(e.target.value))}
            style={{
              padding: 10,
              borderRadius: 12,
              border: "none",
              background: theme === "light" ? "#f1f5f9" : "rgba(255,255,255,0.06)",
              color: theme === "light" ? "#1e293b" : "white",
              width: "50%"
            }}
          />
        </div>
      </div>

      {/* FORECAST GRAPH */}
      <div style={card}>
        <h3>📈 Expense Forecast</h3>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="spent" stroke="#6366f1" strokeWidth={3} />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#f97316"
              strokeWidth={3}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SCENARIO SIMULATOR */}
      <div style={card}>
        <h3>🧪 Scenario Simulator</h3>
        <p>Adjust spending reduction %:</p>

        <input
          type="range"
          min="-50"
          max="50"
          value={sim}
          onChange={(e) => setSim(Number(e.target.value))}
          style={{ width: "100%" }}
        />

        <p style={{ marginTop: 10 }}>
          Adjustment: <b>{sim}%</b>
        </p>

        <h4>
          Predicted Monthly Spend:{" "}
          <span style={{ color: sim < 0 ? "#ef4444" : "#10b981" }}>
            ₹{Math.round(predictedTotal)}
          </span>
        </h4>
      </div>
    </div>
  );
};

export default Budget;
