import React from "react";
import { useTheme } from "../context/ThemeContext";

const SavingsProgress = () => {
  const { accent } = useTheme();
  const percent = 62;
  return (
    <div style={{ padding: 16, borderRadius: 16, background: "var(--card-bg)" }}>
      <div style={{ fontWeight: 800 }}>Savings Goal</div>
      <div style={{ marginTop: 12 }}>
        <div style={{ height: 12, width: '100%', background: '#efefef', borderRadius: 8 }}>
          <div style={{ width: `${percent}%`, height: '100%', background: `linear-gradient(90deg, ${accent}, ${accent}aa)`, borderRadius: 8 }} />
        </div>
        <div style={{ marginTop: 8, fontWeight: 700 }}>{percent}% of ₹50,000</div>
      </div>
    </div>
  );
};

export default SavingsProgress;
