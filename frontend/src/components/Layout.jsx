import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const bg =
    theme === "light"
      ? "linear-gradient(135deg, #faf7ff, #fff9f3)"
      : "linear-gradient(135deg, #0f172a, #1e3a8a, #3b82f6)";

  const sidebarBg =
    theme === "light"
      ? "linear-gradient(135deg, #faf7ff, #fff9f3)"
      : "rgba(255,255,255,0.06)";

  const textColor = theme === "light" ? "#1e293b" : "white";

  const navBtn = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    background: "transparent",
    border: "none",
    padding: "12px 12px",
    borderRadius: "12px",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    color: "inherit",
    fontSize: 16,
  };

  const iconStyle = { width: 18, height: 18, display: "inline-block" };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: bg,
        color: textColor,
      }}
    >
      <aside
        style={{
          width: 300,
          background: sidebarBg,
          borderRight:
            theme === "light"
              ? "1px solid rgba(0,0,0,0.06)"
              : "1px solid rgba(255,255,255,0.12)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: 22,
          boxShadow: theme === "light" ? "0 6px 30px rgba(16,24,40,0.03)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: theme === "light" ? "linear-gradient(135deg,#ffedd5,#fed7aa)" : "linear-gradient(135deg,#c2410c,#f97316)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 1v22" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M5 7h14" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>FinCoach</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Personal finance — private</div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button style={navBtn} onClick={() => navigate("/")}>
            <span style={iconStyle}>🏠</span> Dashboard
          </button>

          <button style={navBtn} onClick={() => navigate("/budget")}>
            <span style={iconStyle}>💸</span> Budget
          </button>

          <button style={navBtn} onClick={() => navigate("/insights")}>
            <span style={iconStyle}>📊</span> Insights
          </button>

          <button style={navBtn} onClick={() => navigate("/coach")}>
            <span style={iconStyle}>🤖</span> AI Coach
          </button>
        </nav>

        <div style={{ marginTop: "auto", display: "flex", gap: 12 }}>
          <button
            onClick={toggleTheme}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              background: theme === "light" ? "#1e293b" : "rgba(255,255,255,0.12)",
              color: theme === "light" ? "white" : "white",
              fontWeight: 600,
            }}
          >
            {theme === "light" ? "Dark" : "Light"} mode
          </button>
          <button
            onClick={() => alert("Profile (demo)")}
            style={{
              padding: 10,
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.06)",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            🙋
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: 28, overflowY: "auto" }}>{children}</main>
    </div>
  );
};

export default Layout;
