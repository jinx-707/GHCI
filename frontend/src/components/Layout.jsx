import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import { useTheme } from "../context/ThemeContext";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const pageBg =
    theme === "light"
      ? "linear-gradient(135deg, #faf7ff, #fff9f3)"
      : "linear-gradient(135deg, #0f172a, #1e3a8a, #3b82f6)";

  const sidebarBg =
    theme === "light"
      ? "linear-gradient(135deg, #faf7ff, #fff9f3)"
      : "rgba(255,255,255,0.06)";

  const navItems = [
    { id: "home", label: "Dashboard", icon: "💹", to: "/" },
    { id: "budget", label: "Budget", icon: "💸", to: "/budget" },
    { id: "insights", label: "Insights", icon: "📊", to: "/insights" },
    { id: "coach", label: "AI Coach", icon: "🤖", to: "/coach" },
    { id: "settings", label: "Settings", icon: "⚙️", to: "/settings" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        background: pageBg,
        overflow: "hidden",
      }}
    >
      <aside
        style={{
          width: 280,
          minHeight: "100vh",
          background: sidebarBg,
          borderRight:
            theme === "light"
              ? "1px solid rgba(0,0,0,0.06)"
              : "1px solid rgba(255,255,255,0.12)",
          padding: 24,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          position: "sticky",
          top: 0,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background:
                theme === "light"
                  ? "linear-gradient(135deg,#dbeafe,#bfdbfe)"
                  : "linear-gradient(135deg,#06b6d4,#7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            {/* growth icon (bars) */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 16v4" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M10 10v10" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M16 6v14" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>FinCoach</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Private • Offline</div>
          </div>
        </div>

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
                  border: "none",
                  cursor: "pointer",
                  background: active
                    ? theme === "light"
                      ? "rgba(30,41,59,0.06)"
                      : "rgba(255,255,255,0.06)"
                    : "transparent",
                  color: theme === "light" ? "#0f172a" : "white",
                  fontWeight: active ? 700 : 600,
                }}
              >
                <div style={{ width: 28, textAlign: "center" }}>{n.icon}</div>
                <div style={{ flex: 1 }}>{n.label}</div>
                {active && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 50,
                      background: theme === "light" ? "#6d28d9" : "#60a5fa",
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", display: "flex", gap: 12 }}>
          <button
            onClick={toggleTheme}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              background:
                theme === "light" ? "#0f172a" : "rgba(255,255,255,0.12)",
              color: "white",
              fontWeight: 700,
            }}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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

      <div
        style={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          background: theme === "light" ? "transparent" : "transparent",
        }}
      >
        <TopBar />
        <main style={{ padding: 28, flex: 1, boxSizing: "border-box" }}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
