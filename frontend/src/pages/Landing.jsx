import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "75vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      background: theme === "light" ? "linear-gradient(135deg,#fff9f3,#faf7ff)" : "linear-gradient(135deg,#0f172a,#1e3a8a)",
      borderRadius: 20,
      boxShadow: theme === "light" ? "0 20px 60px rgba(16,24,40,0.06)" : "0 20px 60px rgba(0,0,0,0.6)"
    }}>
      <div style={{ maxWidth: 1100, display: "grid", gridTemplateColumns: "1fr 420px", gap: 38, alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 40, margin: 0 }}>FinCoach — When life gets unpredictable, your finances don't.</h1>
          <p style={{ opacity: 0.8, marginTop: 12, fontSize: 16 }}>
            Private, offline financial coaching — smart budgets, explainable AI tips, and clear visualizations.
          </p>

          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <button onClick={() => navigate("/insights")} style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg,#6d28d9,#a855f7)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer"
            }}>
              Get demo insights
            </button>

            <button onClick={() => navigate("/coach")} style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.06)",
              background: "transparent",
              cursor: "pointer"
            }}>
              Open AI Coach
            </button>
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
            <div style={{ padding: 12, borderRadius: 12, background: "white", boxShadow: "0 8px 28px rgba(16,24,40,0.06)" }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Users (demo)</div>
              <div style={{ fontWeight: 800 }}>1,200</div>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: "white", boxShadow: "0 8px 28px rgba(16,24,40,0.06)" }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Avg savings</div>
              <div style={{ fontWeight: 800 }}>₹5,200</div>
            </div>
          </div>
        </div>

        <div style={{
          background: theme === "light" ? "linear-gradient(135deg,#f3e8ff,#e9d5ff)" : "linear-gradient(135deg,#6d28d9,#a855f7)",
          borderRadius: 20,
          padding: 18,
          color: theme === "light" ? "#1e293b" : "white",
          boxShadow: "0 10px 40px rgba(0,0,0,0.12)"
        }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>Preview</div>

          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ background: "white", padding: 12, borderRadius: 12 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Monthly Summary</div>
              <div style={{ fontWeight: 800, marginTop: 6 }}>₹50,000</div>
            </div>

            <div style={{ background: "white", padding: 12, borderRadius: 12 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>AI Tips</div>
              <div style={{ fontWeight: 700, marginTop: 6 }}>Save 10% on dining</div>
            </div>

            <div style={{ background: "white", padding: 12, borderRadius: 12 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Insights</div>
              <div style={{ fontWeight: 700, marginTop: 6 }}>Spending trending up 8%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
