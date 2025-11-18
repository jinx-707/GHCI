import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Legend
} from "recharts";

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const trendData = months.map((m, i) => ({
  month: m,
  value: Math.round(15000 + Math.sin(i/2)*2000 + Math.random()*1500),
}));

const categoryData = [
  { name: 'Dining', value: 4200 },
  { name: 'Shopping', value: 3300 },
  { name: 'Utilities', value: 2100 },
  { name: 'Fuel', value: 900 },
  { name: 'Education', value: 700 },
];

const Insights = () => {
  const { theme, accent } = useTheme();
  const [debtMode, setDebtMode] = useState('snowball'); // or 'avalanche'

  const strokeColor = accent || "var(--accent)";

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        <div style={{ padding: 18, borderRadius: 16, background: "var(--card-bg)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 800 }}>Spending Trend</div>
            <div style={{ opacity: 0.7 }}>12 months</div>
          </div>

          <div style={{ height: 220, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#f1f5f9" : "#1f2340"} />
                <XAxis dataKey="month" stroke={theme === "light" ? "#334155" : "#cbd5e1"} />
                <YAxis stroke={theme === "light" ? "#334155" : "#cbd5e1"} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={3} dot={{ r:2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ padding: 18, borderRadius: 16, background: "var(--card-bg)" }}>
          <div style={{ fontWeight: 800 }}>Category Comparison</div>
          <div style={{ height: 220, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#f1f5f9" : "#1f2340"} />
                <XAxis dataKey="name" stroke={theme === "light" ? "#334155" : "#cbd5e1"} />
                <YAxis stroke={theme === "light" ? "#334155" : "#cbd5e1"} />
                <Tooltip />
                <Bar dataKey="value" fill={accent} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Debt Management */}
      <div style={{ padding: 18, borderRadius: 16, background: "var(--card-bg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div>
            <div style={{ fontWeight: 800 }}>Debt Management</div>
            <div style={{ opacity: 0.7 }}>Total Debt: ₹12,500</div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setDebtMode('snowball')} style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: debtMode === 'snowball' ? `2px solid ${accent}` : "1px solid rgba(0,0,0,0.08)",
              background: debtMode === 'snowball' ? accent : "transparent",
              color: debtMode === 'snowball' ? "white" : "var(--text)"
            }}>Snowball</button>

            <button onClick={() => setDebtMode('avalanche')} style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: debtMode === 'avalanche' ? `2px solid ${accent}` : "1px solid rgba(0,0,0,0.08)",
              background: debtMode === 'avalanche' ? accent : "transparent",
              color: debtMode === 'avalanche' ? "white" : "var(--text)"
            }}>Avalanche</button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          {/* Example debts */}
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700 }}>Credit Card</div>
                <div style={{ opacity:0.7 }}>Interest Rate: 18% • Min: ₹50</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>₹1,000</div>
                <div style={{ opacity:0.7 }}>Priority: Pay first</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700 }}>Personal Loan</div>
                <div style={{ opacity:0.7 }}>Interest Rate: 12% • Min: ₹150</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>₹3,500</div>
                <div style={{ opacity:0.7 }}>Suggested extra: ₹200/mo</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700 }}>Student Loan</div>
                <div style={{ opacity:0.7 }}>Interest Rate: 6% • Min: ₹100</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>₹8,000</div>
                <div style={{ opacity:0.7 }}>Low priority</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Insights;
