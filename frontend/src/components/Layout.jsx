import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import { useTheme } from "../context/ThemeContext";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: "home", label: "Dashboard", icon: "📊", to: "/" },
    { id: "budget", label: "Budget", icon: "💸", to: "/budget" },
    { id: "insights", label: "Insights", icon: "🔍", to: "/insights" },
    { id: "coach", label: "AI Coach", icon: "🤖", to: "/coach" },
    { id: "settings", label: "Settings", icon: "⚙️", to: "/settings" },
  ];

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: 280,
          minHeight: "100vh",
          background: theme === "light"
            ? "rgba(255,255,255,0.7)"
            : "rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px)",
          borderRight:
            theme === "light"
              ? "1px solid rgba(0,0,0,0.06)"
              : "1px solid rgba(255,255,255,0.08)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          position: "sticky",
          top: 0,
        }}
      >
        {/* LOGO */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `var(--accent)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 26,
            }}
          >
            ⚡
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>FinCoach</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Private • Offline</div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {navItems.map((n) => {
            const active = location.pathname === n.to;

            return (
              <button
                key={n.id}
                onClick={() => navigate(n.to)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: active
                    ? "var(--accent)"
                    : "transparent",
                  color: active ? "white" : "var(--text)",
                  border: "none",
                  fontWeight: active ? 700 : 600,
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                <span style={{ width: 30, textAlign: "center" }}>
                  {n.icon}
                </span>
                {n.label}
              </button>
            );
          })}
        </nav>

        {/* FOOTER BUTTONS */}
        <div style={{ marginTop: "auto", display: "flex", gap: 12 }}>
          <button
            onClick={toggleTheme}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "none",
              background: "var(--accent)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>
      </aside>

      {/* MAIN SECTION */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <TopBar />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 28,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
