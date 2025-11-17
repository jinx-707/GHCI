import React from "react";
import { useTheme } from "../context/ThemeContext";

const SavingsProgress = () => {
  const { theme } = useTheme();
  const bg = theme === "light" ? "white" : "rgba(255,255,255,0.04)";
  return (
    <div style={{ background: bg, padding: 18, borderRadius: 16, border: theme === "light" ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ fontWeight: 800 }}>Savings Progress</div>
      <div style={{ marginTop: 10 }}>
        <div style={{ height: 10, background: theme === "light" ? "#e2e8f0" : "rgba(255,255,255,0.06)", borderRadius: 10 }}>
          <div style={{ width: "63%", height: "100%", background: "linear-gradient(90deg,#4ade80,#16a34a)", borderRadius: 10 }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>₹31,500 saved</div>
      </div>
    </div>
  );
};

export default SavingsProgress;
