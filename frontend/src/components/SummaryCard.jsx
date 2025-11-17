import React from "react";
import { useTheme } from "../context/ThemeContext";

const SummaryCard = ({ income = 50000, expenses = 18500 }) => {
  const { theme } = useTheme();
  const savings = income - expenses;

  const cardStyle = {
    background:
      theme === "light"
        ? "linear-gradient(135deg, #ffedd5, #fed7aa)" // orange pastel
        : "linear-gradient(135deg, #c2410c, #f97316)",
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
          <div style={{ fontSize: 14, opacity: 0.9 }}>Monthly Summary</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>₹{income.toLocaleString()}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          {/* rupee svg */}
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.2)"/>
            <path d="M8 8h8M8 12h6M10 16h6" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 18 }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Expenses</div>
          <div style={{ fontWeight: 700, marginTop: 6 }}>₹{expenses.toLocaleString()}</div>
        </div>

        <div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Savings</div>
          <div style={{ fontWeight: 700, marginTop: 6 }}>₹{savings.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
