import React from "react";
import { useTheme } from "../context/ThemeContext";

const RecentTransactions = () => {
  const { theme } = useTheme();
  const bg = theme === "light" ? "white" : "rgba(255,255,255,0.04)";

  const sample = [
    { id: 1, title: "Starbucks", amount: 450, cat: "Dining" },
    { id: 2, title: "Amazon", amount: 1299, cat: "Shopping" },
    { id: 3, title: "Uber", amount: 320, cat: "Transport" },
  ];

  return (
    <div style={{ background: bg, padding: 18, borderRadius: 16, border: theme === "light" ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)" }}>
      <h4 style={{ marginTop: 0 }}>Recent Transactions</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {sample.map(tx => (
          <li key={tx.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px dashed rgba(0,0,0,0.04)" }}>
            <div>
              <div style={{ fontWeight: 700 }}>{tx.title}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{tx.cat}</div>
            </div>
            <div style={{ fontWeight: 700 }}>₹{tx.amount}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
