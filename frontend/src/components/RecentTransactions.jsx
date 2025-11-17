import React from "react";
import { useTheme } from "../context/ThemeContext";

const RecentTransactions = ({ items }) => {
  const { theme } = useTheme();

  const cardStyle = {
    background: theme === "light" ? "white" : "rgba(255,255,255,0.04)",
    borderRadius: 24,
    padding: 20,
    color: theme === "light" ? "#1e293b" : "white",
    boxShadow: theme === "light" ? "0 10px 30px rgba(16,24,40,0.04)" : "0 10px 30px rgba(0,0,0,0.45)",
  };

  const data = items || [
    { id: 1, merchant: "Starbucks", date: "2025-06-05", amount: -450 },
    { id: 2, merchant: "Zomato", date: "2025-06-03", amount: -820 },
    { id: 3, merchant: "Salary", date: "2025-06-01", amount: 50000 },
    { id: 4, merchant: "Amazon", date: "2025-05-28", amount: -1200 },
  ];

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Recent Transactions</div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>Showing latest</div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {data.map((tx) => (
          <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 12, background: theme === "light" ? "#fafafa" : "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: theme === "light" ? "#fff" : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {tx.merchant.toLowerCase().includes("star") ? "☕" : tx.merchant.toLowerCase().includes("zom") ? "🍽️" : tx.merchant.toLowerCase().includes("amazon") ? "📦" : "💳"}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{tx.merchant}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{tx.date}</div>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: tx.amount < 0 ? "#ef4444" : "#10b981" }}>
                {tx.amount < 0 ? "-" : "+"}₹{Math.abs(tx.amount)}
              </div>
              <div style={{ fontSize: 12, opacity: 0.65 }}>{tx.amount < 0 ? "Debit" : "Credit"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
