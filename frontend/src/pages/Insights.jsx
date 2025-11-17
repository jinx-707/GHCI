import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

const Insights = () => {
  const { theme } = useTheme();

  const periods = ["Daily", "Weekly", "Monthly"];
  const [period, setPeriod] = useState("Monthly");

  // 12 months data 💜
  const dataMap = {
    Monthly: [
      { month: "Jan", amount: 12000 },
      { month: "Feb", amount: 11500 },
      { month: "Mar", amount: 14000 },
      { month: "Apr", amount: 13000 },
      { month: "May", amount: 15000 },
      { month: "Jun", amount: 16700 },
      { month: "Jul", amount: 17200 },
      { month: "Aug", amount: 18000 },
      { month: "Sep", amount: 16000 },
      { month: "Oct", amount: 15500 },
      { month: "Nov", amount: 14900 },
      { month: "Dec", amount: 18300 },
    ],
    Weekly: [
      { month: "W1", amount: 3200 },
      { month: "W2", amount: 2800 },
      { month: "W3", amount: 3500 },
      { month: "W4", amount: 3400 },
    ],
    Daily: [
      { month: "Mon", amount: 700 },
      { month: "Tue", amount: 680 },
      { month: "Wed", amount: 900 },
      { month: "Thu", amount: 850 },
      { month: "Fri", amount: 1100 },
      { month: "Sat", amount: 500 },
      { month: "Sun", amount: 300 },
    ],
  };

  const barData = [
    { cat: "Dining", amt: 3200 },
    { cat: "Shopping", amt: 4500 },
    { cat: "Transport", amt: 1600 },
    { cat: "Entertainment", amt: 1200 },
  ];

  const insights = [
    { icon: "🍽️", text: "Dining up 18% this month" },
    { icon: "🛍️", text: "Shopping down 9% from last month" },
    { icon: "🚗", text: "Transport stable" },
    { icon: "🎬", text: "Entertainment slightly up" },
  ];

  const card = (light, dark) => ({
    background: theme === "light" ? light : dark,
    borderRadius: 24,
    padding: 22,
    color: theme === "light" ? "#1e293b" : "white",
    boxShadow:
      theme === "light"
        ? "0 8px 28px rgba(16,24,40,0.08)"
        : "0 8px 28px rgba(0,0,0,0.4)",
  });

  const anomaly =
    Math.random() > 0.5
      ? "⚠️ Unusual transaction detected: ₹2,200 at Amazon."
      : "No anomalies detected ✔️";

  const projected = 27800;

  // Graph text color based on theme
  const axisColor = theme === "light" ? "#1e293b" : "white";

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 16 }}>📈 Insights & Trends</h2>

      {/* Period Selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: "8px 14px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              background:
                period === p
                  ? "linear-gradient(135deg,#6d28d9,#a855f7)"
                  : theme === "light"
                  ? "#e5e7eb"
                  : "rgba(255,255,255,0.1)",
              color: "white",
              fontWeight: 600,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 22 }}>
        {/* LINE CHART */}
        <div
          style={card(
            "white", // clearer for light mode
            "rgba(255,255,255,0.08)" // dark glass
          )}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ opacity: 0.85 }}>Spending Trend</div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>{period}</div>
            </div>
            <div style={{ fontSize: 20 }}>📉</div>
          </div>

          <div style={{ width: "100%", height: 260, marginTop: 12 }}>
            <ResponsiveContainer>
              <LineChart data={dataMap[period]}>
                <CartesianGrid
                  stroke={
                    theme === "light" ? "#e5e7eb" : "rgba(255,255,255,0.1)"
                  }
                  strokeDasharray="3 3"
                />
                <XAxis dataKey="month" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#6d28d9"   // TREND LINE COLOR
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* SAVINGS PROJECTION */}
          <div
            style={card(
              "linear-gradient(135deg,#fef9c3,#fde68a)",
              "linear-gradient(135deg,#b45309,#f59e0b)"
            )}
          >
            <div style={{ fontSize: 14, opacity: 0.8 }}>📌 Projected Savings</div>
            <div style={{ marginTop: 8, fontSize: 22, fontWeight: 700 }}>
              ₹{projected.toLocaleString()}
            </div>
            <div style={{ opacity: 0.8, marginTop: 4 }}>
              Based on your last 3 months.
            </div>
          </div>

          {/* ANOMALY DETECTION */}
          <div
            style={card(
              "linear-gradient(135deg,#ffedd5,#fed7aa)",
              "linear-gradient(135deg,#c2410c,#f97316)"
            )}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>⚠️ Anomalies</div>
            <div>{anomaly}</div>
          </div>
        </div>
      </div>

      {/* CATEGORY INSIGHTS */}
      <h3 style={{ marginTop: 24, marginBottom: 10 }}>Category Insights</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 16,
        }}
      >
        {insights.map((i) => (
          <div
            key={i.text}
            style={card(
              "linear-gradient(135deg,#f3e8ff,#e9d5ff)",
              "linear-gradient(135deg,#6d28d9,#a855f7)"
            )}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ fontSize: 22 }}>{i.icon}</div>
              <div style={{ fontWeight: 700 }}>{i.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* BAR CHART */}
      <h3 style={{ marginTop: 28 }}>Category Comparison</h3>
      <div
        style={card(
          "white", // easy to see
          "rgba(255,255,255,0.08)" // glass
        )}
      >
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <XAxis dataKey="cat" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip />
              <Bar dataKey="amt" fill="#a855f7" radius={[10, 10, 0, 0]} /> {/* PURPLE BARS */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Insights;
