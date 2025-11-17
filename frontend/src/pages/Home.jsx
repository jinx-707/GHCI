import React from "react";
import { useTheme } from "../context/ThemeContext";
import SummaryCard from "../components/SummaryCard";
import SavingsProgress from "../components/SavingsProgress";
import SpendingPieChart from "../components/SpendingPieChart";
import RecentTransactions from "../components/RecentTransactions";

const Home = () => {
  const { theme } = useTheme();

  return (
    <div style={{ display: "grid", gap: 24 }}>

      {/* TOP ROW — SUMMARY + SAVINGS + PIE */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 350px" }}>
          <SummaryCard />
        </div>

        <div style={{ width: 360, display: "grid", gap: 18 }}>
          <SavingsProgress />
          <SpendingPieChart />
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <RecentTransactions />

      {/* INVESTMENT PORTFOLIO */}
      <div
        style={{
          background: theme === "light" ? "white" : "rgba(255,255,255,0.06)",
          padding: 24,
          borderRadius: 22,
          boxShadow:
            theme === "light"
              ? "0 8px 28px rgba(16,24,40,0.06)"
              : "0 8px 28px rgba(0,0,0,0.45)",
          marginTop: 12,
        }}
      >
        <h2 style={{ marginBottom: 12 }}>💼 Investment Portfolio</h2>

        <h3 style={{ margin: "0 0 18px 0", opacity: 0.8 }}>
          Total Value: <b>₹6,040</b>
        </h3>

        {/* ASSET LIST */}
        <div style={{ display: "grid", gap: 14 }}>

          {/* AAPL */}
          <div
            style={{
              padding: 14,
              borderRadius: 16,
              background: theme === "light" ? "#fff7ed" : "rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div><b>AAPL</b> — Stock</div>
            <div style={{ textAlign: "right" }}>
              <div>₹900</div>
              <div style={{ color: "#16a34a", fontWeight: 700 }}>+12.5%</div>
            </div>
          </div>

          {/* GOOGL */}
          <div
            style={{
              padding: 14,
              borderRadius: 16,
              background: theme === "light" ? "#fffbeb" : "rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div><b>GOOGL</b> — Stock</div>
            <div style={{ textAlign: "right" }}>
              <div>₹280</div>
              <div style={{ color: "#dc2626", fontWeight: 700 }}>-3.2%</div>
            </div>
          </div>

          {/* VOO */}
          <div
            style={{
              padding: 14,
              borderRadius: 16,
              background: theme === "light" ? "#ecfdf5" : "rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div><b>VOO</b> — ETF</div>
            <div style={{ textAlign: "right" }}>
              <div>₹3,360</div>
              <div style={{ color: "#16a34a", fontWeight: 700 }}>+8.7%</div>
            </div>
          </div>

          {/* MUTUAL FUND */}
          <div
            style={{
              padding: 14,
              borderRadius: 16,
              background: theme === "light" ? "#eef2ff" : "rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div><b>Mutual Fund A</b> — MF</div>
            <div style={{ textAlign: "right" }}>
              <div>₹1,500</div>
              <div style={{ color: "#16a34a", fontWeight: 700 }}>+5.3%</div>
            </div>
          </div>
        </div>

        {/* RISK PROFILE */}
        <div style={{ marginTop: 26 }}>
          <h3 style={{ marginBottom: 12 }}>🎯 Risk Profile</h3>

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{
              padding: "6px 14px",
              background: "rgba(239,68,68,0.15)",
              borderRadius: 30,
              color: "#dc2626",
              fontWeight: 600,
            }}>Low</div>

            <div style={{
              padding: "6px 14px",
              background: "rgba(16,185,129,0.2)",
              borderRadius: 30,
              color: "#059669",
              fontWeight: 600,
            }}>Medium</div>

            <div style={{
              padding: "6px 14px",
              background: "rgba(99,102,241,0.2)",
              borderRadius: 30,
              color: "#4f46e5",
              fontWeight: 600,
            }}>High</div>
          </div>
        </div>

        {/* ALLOCATION */}
        <div style={{ marginTop: 24 }}>
          <h3>📊 Recommended Allocation</h3>

          {[
            { label: "Stocks", pct: 60, color: "#6366f1" },
            { label: "Bonds", pct: 30, color: "#10b981" },
            { label: "Cash", pct: 10, color: "#f59e0b" },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: 14 }}>
              {item.label} — {item.pct}%
              <div
                style={{
                  height: 10,
                  background: "rgba(0,0,0,0.1)",
                  marginTop: 6,
                  borderRadius: 20,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${item.pct}%`,
                    background: item.color,
                    borderRadius: 20,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;
