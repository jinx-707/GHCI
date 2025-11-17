import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const rawBudgets = [
  { category: "Dining", limit: 5000, spent: 3200, icon: "🍽️" },
  { category: "Shopping", limit: 8000, spent: 4500, icon: "🛍️" },
  { category: "Transport", limit: 2500, spent: 1600, icon: "🚗" },
  { category: "Entertainment", limit: 4000, spent: 1200, icon: "🎬" },
];

const months = ["January", "February", "March", "April", "May", "June"];

const Budget = () => {
  const { theme } = useTheme();
  const [budgets, setBudgets] = useState(rawBudgets);
  const [month, setMonth] = useState("June");

  const updateLimit = (i, newLimit) => {
    let copy = [...budgets];
    copy[i].limit = Number(newLimit || 0);
    setBudgets(copy);
  };

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

  const sorted = [...budgets].sort((a, b) => b.spent - a.spent);
  const topCategory = sorted[0];

  const spendingTips = [
    "Try reducing dining by 10% — easy win 💡",
    "Shopping is rising — set a weekly limit 🛍️",
    "Make transport budget fixed (like ₹300/week) 🚗",
    "Your entertainment is healthier than last month 🎬",
  ];

  const tip = spendingTips[Math.floor(Math.random() * spendingTips.length)];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 16 }}>💼 Budget Planner</h2>

      {/* Month Selector */}
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          border: "none",
          marginBottom: 20,
          background: theme === "light" ? "#fff" : "rgba(255,255,255,0.06)",
          color: theme === "light" ? "#1e293b" : "white",
        }}
      >
        {months.map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>

      {/* AI TIP CARD */}
      <div
        style={card(
          "linear-gradient(135deg,#fef9c3,#fde68a)",
          "linear-gradient(135deg,#b45309,#f59e0b)"
        )}
      >
        <div style={{ fontSize: 15, opacity: 0.9 }}>🤖 AI Suggestion</div>
        <div style={{ marginTop: 8, fontWeight: 700 }}>{tip}</div>
      </div>

      {/* Leaderboard */}
      <div
        style={{
          marginTop: 20,
          ...card(
            "linear-gradient(135deg,#ffedd5,#fed7aa)",
            "linear-gradient(135deg,#c2410c,#f97316)"
          ),
        }}
      >
        <div style={{ fontSize: 14, opacity: 0.85 }}>🔥 Top Spending Category</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>
          {topCategory.icon} {topCategory.category}: ₹
          {topCategory.spent.toLocaleString()}
        </div>
      </div>

      {/* BUDGET CARDS */}
      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 20,
        }}
      >
        {budgets.map((b, i) => {
          const percent = Math.min(100, Math.round((b.spent / b.limit) * 100));

          const status =
            percent >= 100
              ? { label: "Over Budget", color: "#ef4444", emoji: "🔥" }
              : percent >= 80
              ? { label: "Near Limit", color: "#f59e0b", emoji: "⚠️" }
              : { label: "Healthy", color: "#10b981", emoji: "🟢" };

          const bg = i % 2 === 0
            ? ["linear-gradient(135deg,#ffedd5,#fed7aa)", "linear-gradient(135deg,#c2410c,#f97316)"]
            : ["linear-gradient(135deg,#fef9c3,#fde68a)", "linear-gradient(135deg,#b45309,#f59e0b)"];

          return (
            <div key={i} style={card(bg[0], bg[1])}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14 }}>{b.icon} {b.category}</div>
                  <div style={{ marginTop: 4, fontWeight: 700 }}>
                    ₹{b.spent.toLocaleString()}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>Limit</div>
                  <input
                    type="number"
                    defaultValue={b.limit}
                    onChange={(e) => updateLimit(i, e.target.value)}
                    style={{
                      marginTop: 6,
                      padding: "6px 8px",
                      borderRadius: 8,
                      border: "none",
                      width: 90,
                      background: theme === "light" ? "#fff" : "rgba(255,255,255,0.06)",
                      color: theme === "light" ? "#1e293b" : "white",
                    }}
                  />
                </div>
              </div>

              {/* Badge */}
              <div
                style={{
                  padding: "6px 10px",
                  borderRadius: 10,
                  marginTop: 10,
                  display: "inline-block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "white",
                  background: status.color,
                }}
              >
                {status.emoji} {status.label}
              </div>

              {/* Progress */}
              <div style={{ marginTop: 14 }}>
                <div
                  style={{
                    height: 12,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.3)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background: "linear-gradient(90deg,#f97316,#f59e0b)",
                    }}
                  />
                </div>
                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>
                  ₹{(b.limit - b.spent).toLocaleString()} left
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budget;
