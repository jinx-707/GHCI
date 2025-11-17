import React from "react";
import { useTheme } from "../context/ThemeContext";

const SavingsProgress = ({ income = 50000, expenses = 18500 }) => {
  const { theme } = useTheme();
  const savings = income - expenses;
  const percent = Math.max(0, Math.min(100, Math.round((savings / income) * 100)));

  const cardStyle = {
    background:
      theme === "light"
        ? "linear-gradient(135deg, #fef9c3, #fde68a)"
        : "linear-gradient(135deg, #b45309, #f59e0b)",
    borderRadius: 24,
    padding: 22,
    color: theme === "light" ? "#1e293b" : "white",
    boxShadow:
      theme === "light"
        ? "0 8px 30px rgba(16,24,40,0.06)"
        : "0 8px 30px rgba(0,0,0,0.45)",
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Savings Progress</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>₹{savings.toLocaleString()}</div>
        </div>
        <div style={{ fontSize: 32 }}>🐷</div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ height: 14, width: "100%", background: "rgba(255,255,255,0.18)", borderRadius: 12, overflow: "hidden" }}>
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              background: "linear-gradient(90deg,#f59e0b,#f97316)",
              transition: "width 0.6s ease",
            }}
          />
        </div>
        <div style={{ marginTop: 10, fontSize: 13, opacity: 0.9 }}>{percent}% of income saved</div>
      </div>
    </div>
  );
};

export default SavingsProgress;
