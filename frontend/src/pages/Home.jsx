import React from "react";
import { useTheme } from "../context/ThemeContext";
import SummaryCard from "../components/SummaryCard";
import SpendingPieChart from "../components/SpendingPieChart";
import RecentTransactions from "../components/RecentTransactions";
import SavingsProgress from "../components/SavingsProgress";

const Home = () => {
  const { theme } = useTheme();

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "stretch" }}>
        <div style={{ flex: "1 1 420px" }}>
          <SummaryCard />
        </div>

        <div style={{ width: 360, display: "grid", gap: 20 }}>
          <SavingsProgress />
          <SpendingPieChart />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 22 }}>
        <div>
          <RecentTransactions />
        </div>

        <div>
          <div style={{
            padding: 18,
            borderRadius: 16,
            background: "var(--card-bg)",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "var(--shadow-soft)"
          }}>
            <div style={{ fontWeight: 800 }}>Investment Portfolio</div>
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Total Value</div>
                  <div style={{ opacity: 0.75 }}>₹6,040</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>Risk: Medium</div>
                  <div style={{ opacity: 0.75 }}>Alloc: Stocks 60% • Bonds 30%</div>
                </div>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>AAPL • Stock</div><div>₹900 • +12.5%</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>GOOGL • Stock</div><div>₹280 • -3.2%</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>VOO • ETF</div><div>₹3,360 • +8.7%</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>Mutual Fund A</div><div>₹1,500 • +5.3%</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 10 }} />
        </div>
      </div>
    </div>
  );
};

export default Home;
