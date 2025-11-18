import React from "react";
import { useTheme } from "../context/ThemeContext";

const SummaryCard = () => {
  const { accent } = useTheme();
  return (
    <div style={{ padding: 18, borderRadius: 16, background: "var(--card-bg)", boxShadow: "var(--shadow-soft)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 800 }}>Monthly Summary</div>
          <div style={{ opacity: 0.7 }}>Income • Expenses • Savings</div>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)`, padding: 10, borderRadius: 12, color: "white", fontWeight: 800 }}>
          ₹31,500
        </div>
      </div>
      <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
        <div style={{ opacity: 0.8 }}>Income: ₹50,000</div>
        <div style={{ opacity: 0.8 }}>Expenses: ₹18,500</div>
        <div style={{ fontWeight: 700 }}>Savings So Far: ₹31,500</div>
      </div>
    </div>
  );
};

export default SummaryCard;
