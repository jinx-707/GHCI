import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

const Insights = () => {
  const { theme } = useTheme();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const spendingTrendData = months.map((m, i) => ({
    month: m,
    spent: 5000 + (i * 800) % 2500,
  }));

  const categoryData = [
    { cat: "Dining", amt: 2300 },
    { cat: "Shopping", amt: 3800 },
    { cat: "Groceries", amt: 1600 },
    { cat: "Fuel", amt: 900 },
    { cat: "Subscriptions", amt: 1100 },
  ];

  // DEBT DATA
  const originalDebts = [
    {
      title: "🎯 Credit Card",
      rate: 18,
      min: "₹50",
      total: 1000,
      extra: "₹200/month extra clears in 4 months.",
    },
    {
      title: "Personal Loan",
      rate: 12,
      min: "₹150",
      total: 3500,
    },
    {
      title: "Student Loan",
      rate: 6,
      min: "₹100",
      total: 8000,
    },
  ];

  const [method, setMethod] = useState("snowball"); // "snowball" or "avalanche"

  // Sorting logic
  const sortedDebts =
    method === "snowball"
      ? [...originalDebts].sort((a, b) => a.total - b.total)
      : [...originalDebts].sort((a, b) => b.rate - a.rate);

  const cardStyle = {
    background: theme === "light" ? "white" : "rgba(255,255,255,0.05)",
    padding: 22,
    borderRadius: 22,
    boxShadow:
      theme === "light"
        ? "0 8px 28px rgba(16,24,40,0.06)"
        : "0 8px 28px rgba(0,0,0,0.45)",
    border: theme === "light" ? "1px solid #e5e7eb" : "1px solid rgba(255,255,255,0.06)",
  };

  const titleStyle = {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
    color: theme === "light" ? "#0f172a" : "white",
  };

  return (
    <div style={{ padding: 20, display: "grid", gap: 24 }}>

      {/* ========== SPENDING TREND ========== */}
      <div style={cardStyle}>
        <div style={titleStyle}>📈 Spending Trend</div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={spendingTrendData}>
            <CartesianGrid strokeDasharray="4 4" opacity={0.2} />
            <XAxis dataKey="month" stroke={theme === "light" ? "#1e293b" : "white"} />
            <YAxis stroke={theme === "light" ? "#1e293b" : "white"} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="spent"
              stroke={theme === "light" ? "#4f46e5" : "#38bdf8"}
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ========== CATEGORY COMPARISON ========== */}
      <div style={cardStyle}>
        <div style={titleStyle}>📊 Category Comparison</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="4 4" opacity={0.2} />
            <XAxis dataKey="cat" stroke={theme === "light" ? "#1e293b" : "white"} />
            <YAxis stroke={theme === "light" ? "#1e293b" : "white"} />
            <Tooltip />
            <Bar
              dataKey="amt"
              fill={theme === "light" ? "#a855f7" : "#60a5fa"}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ========== DEBT MANAGEMENT ========== */}
      <div style={cardStyle}>
        <div style={titleStyle}>💳 Debt Management</div>

        <h3 style={{ marginTop: 0, opacity: 0.7 }}>
          Total Debt: <b>₹12,500</b>
        </h3>

        {/* TOGGLE BUTTONS */}
        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <button
            onClick={() => setMethod("snowball")}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              background:
                method === "snowball"
                  ? "rgba(99,102,241,0.25)"
                  : "rgba(99,102,241,0.12)",
              color: theme === "light" ? "#4f46e5" : "#c7d2fe",
              fontWeight: 700,
            }}
          >
            Snowball
          </button>

          <button
            onClick={() => setMethod("avalanche")}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              background:
                method === "avalanche"
                  ? "rgba(16,185,129,0.25)"
                  : "rgba(16,185,129,0.12)",
              color: theme === "light" ? "#059669" : "#6ee7b7",
              fontWeight: 700,
            }}
          >
            Avalanche
          </button>
        </div>

        {/* DEBT LIST */}
        <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
          {sortedDebts.map((d, i) => (
            <div
              key={i}
              style={{
                padding: 16,
                borderRadius: 18,
                background:
                  i === 0
                    ? theme === "light"
                      ? "#fef3c7"
                      : "rgba(255,255,255,0.08)"
                    : theme === "light"
                    ? "#f8fafc"
                    : "rgba(255,255,255,0.04)",
                border:
                  i === 0
                    ? "2px solid #f59e0b"
                    : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700 }}>{d.title}</div>

              <div style={{ opacity: 0.7, marginTop: 4 }}>
                Interest Rate: <b>{d.rate}%</b> | Min Payment: <b>{d.min}</b>
              </div>

              <div style={{ marginTop: 6, fontSize: 18, fontWeight: 600 }}>
                ₹{d.total.toLocaleString()}
              </div>

              {i === 0 && method === "snowball" && (
                <div style={{ marginTop: 6, color: "#b45309", fontWeight: 600 }}>
                  🎯 Smallest debt first → fastest wins.
                  <br />
                  {d.extra}
                </div>
              )}

              {i === 0 && method === "avalanche" && (
                <div style={{ marginTop: 6, color: "#065f46", fontWeight: 600 }}>
                  ⚡ Highest interest first → saves the most money long term.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Insights;
