import React from "react";
import { useTheme } from "../context/ThemeContext";

const mock = [
  { id:1, merchant: "Starbucks", amount: 450, cat:"Dining" },
  { id:2, merchant: "Amazon", amount: 1250, cat:"Shopping" },
  { id:3, merchant: "Shell", amount: 900, cat:"Fuel" },
];

const RecentTransactions = () => {
  const { theme } = useTheme();
  return (
    <div style={{ padding: 16, borderRadius: 16, background: "var(--card-bg)" }}>
      <div style={{ fontWeight: 800 }}>Recent Transactions</div>
      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        {mock.map(t => (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: 10, borderRadius: 10, background: theme === "light" ? "#fbfbfb" : "rgba(255,255,255,0.02)" }}>
            <div>
              <div style={{ fontWeight: 700 }}>{t.merchant}</div>
              <div style={{ opacity: 0.7 }}>{t.cat}</div>
            </div>
            <div style={{ fontWeight: 800 }}>₹{t.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
