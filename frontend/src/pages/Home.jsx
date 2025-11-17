import React from "react";
import SummaryCard from "../components/SummaryCard";
import RecentTransactions from "../components/RecentTransactions";
import SpendingPieChart from "../components/SpendingPieChart";
import SavingsProgress from "../components/SavingsProgress";
import { useTheme } from "../context/ThemeContext";


const Home = () => {
  return (
    <div
      style={{
        padding: "20px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "25px",
        width: "100%",
        animation: "fadeIn 0.5s ease",
      }}
    >
      {/* TOP LEFT */}
      <SummaryCard />

      {/* TOP RIGHT */}
      <SavingsProgress />

      {/* SECOND ROW LEFT */}
      <SpendingPieChart />

      {/* RECENT TRANSACTIONS — FULL WIDTH */}
      <div style={{ gridColumn: "span 2" }}>
        <RecentTransactions />
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
