import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import { useTheme } from "../context/ThemeContext";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const bg =
    theme === "light"
      ? "linear-gradient(135deg, #faf7ff, #fff9f3)"
      : "linear-gradient(135deg, #0f172a, #1e3a8a, #3b82f6)";

  const sidebarBg =
    theme === "light"
      ? "linear-gradient(135deg, #faf7ff, #fff9f3)"
      : "rgba(255,255,255,0.06)";

  // ⭐ UPDATED NAV LIST (NO GAP, SETTINGS INCLUDED)
  const navItems = [
    { id: "home", label: "Dashboard", icon: "🏠", to: "/" },
    { id: "budget", label: "Budget", icon: "💸", to: "/budget" },
    { id: "insights", label: "Insights", icon: "📊", to: "/insights" },
    { id: "coach", label: "AI Coach", icon: "🤖", to: "/coach" },

    // NEW PAGE
    { id: "lifestyle", label: "Lifestyle", icon: "✨", to: "/lifestyle" },

    // SETTINGS BELOW LIFESTYLE
    { id: "settings", label: "Settings", icon: "⚙️", to: "/settings" },
  ];

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        overflow: "hidden",
        background: bg,
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: 300,
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
        }}
      >
        {/* LOGO */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background:
                theme === "light"
                  ? "linear-gradient(135deg,#ffedd5,#fed7aa)"
                  : "linear-gradient(135deg,#c2410c,#f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <span style={{ fontSize: 22 }}>💎</span>
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>FinCoach</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Private • Offline</div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                      : "rgba(255,255,255,0.08)"
                    : "transparent",
                  color: theme === "light" ? "#0f172a" : "white",
                  fontWeight: active ? 700 : 600,
                  transition: "all .15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateX(6px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateX(0px)")
                }
              >
                <div style={{ width: 30, textAlign: "center" }}>{n.icon}</div>
                <div style={{ flex: 1 }}>{n.label}</div>

                {active && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 10,
                      background:
                        theme === "light" ? "#6d28d9" : "#60a5fa",
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* THEME BUTTON */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: 12,
            paddingTop: 10,
          }}
        >
          <button
            onClick={toggleTheme}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              background:
                theme === "light"
                  ? "#0f172a"
                  : "rgba(255,255,255,0.12)",
              color: "white",
              fontWeight: 700,
            }}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div
        style={{
          flex: 1,
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <TopBar />
        <main
          style={{
            padding: 28,
            flex: 1,
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
