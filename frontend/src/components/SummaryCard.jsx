import React from "react";
import { useTheme } from "../context/ThemeContext";

const SummaryCard = () => {
  const { theme } = useTheme();
  const style = {
    background: theme === "light" ? "white" : "rgba(255,255,255,0.04)",
    padding: 22, borderRadius: 16, border: theme === "light" ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)"
  };

  return (
    <div style={style}>
      <h3 style={{ marginTop: 0 }}>Monthly Summary</h3>
      <p style={{ margin: 0, opacity: 0.8 }}>Income: ₹50,000</p>
      <p style={{ margin: 0, opacity: 0.8 }}>Expenses: ₹18,500</p>
      <p style={{ marginTop: 6, fontWeight: 600 }}>Savings: ₹31,500</p>
    </div>
  );
};

export default SummaryCard;
