import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, getThemeColors } = useTheme();
  const colors = getThemeColors();

  const navItems = [
    { id: "home", label: "Home", icon: "🏠", to: "/" },
    { id: "dashboard", label: "Live Dashboard", icon: "📊", to: "/dashboard" },
    { id: "budget", label: "Budget", icon: "💰", to: "/budget" },
    { id: "insights", label: "Insights", icon: "🔍", to: "/insights" },
    { id: "ai-insights", label: "AI Insights", icon: "🧠", to: "/ai-insights" },
    { id: "coach", label: "AI Coach", icon: "🤖", to: "/coach" },
    { id: "lifestyle", label: "Lifestyle", icon: "✨", to: "/lifestyle" },
    { id: "settings", label: "Settings", icon: "⚙️", to: "/settings" },
  ];

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      overflow: "hidden",
      background: colors.bg,
    }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{
        width: 300,
        minHeight: "100vh",
        background: colors.sidebarBg,
        borderRight: `1px solid ${colors.border}`,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        backdropFilter: "blur(20px)",
      }}>
        {/* Logo */}
        <div style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          paddingBottom: 16,
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentHover})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: colors.shadow,
          }}>
            <span style={{ fontSize: 24 }}>💎</span>
          </div>
          <div>
            <div style={{
              fontWeight: 800,
              fontSize: 20,
              color: colors.text,
              marginBottom: 2,
            }}>
              FinCoach AI
            </div>
            <div style={{
              fontSize: 12,
              color: colors.textSecondary,
            }}>
              Live Backend Connected
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
        }}>
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.to)}
                className="slideIn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  background: active ? colors.glass : "transparent",
                  color: active ? colors.accent : colors.text,
                  fontWeight: active ? 700 : 500,
                  fontSize: 15,
                  transition: "all 0.2s ease",
                  textAlign: "left",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = colors.glass;
                    e.currentTarget.style.transform = "translateX(4px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "translateX(0)";
                  }
                }}
              >
                <span style={{ fontSize: 20, width: 24, textAlign: "center" }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {active && (
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: colors.accent,
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div style={{
          paddingTop: 16,
          borderTop: `1px solid ${colors.border}`,
        }}>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{
              width: "100%",
              justifyContent: "center",
              background: colors.glass,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            <span>{theme === "light" ? "🌙" : "☀️"}</span>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Top Bar */}
        <header style={{
          padding: "20px 32px",
          background: colors.cardBg,
          borderBottom: `1px solid ${colors.border}`,
          backdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <h1 style={{
              fontSize: 24,
              fontWeight: 700,
              color: colors.text,
              margin: 0,
            }}>
              {navItems.find(item => item.to === location.pathname)?.label || "Home"}
            </h1>
            <p style={{
              fontSize: 14,
              color: colors.textSecondary,
              margin: 0,
            }}>
              {location.pathname === '/dashboard' ? 'Live backend connection' : 'Welcome back! Here\'s your financial overview.'}
            </p>
          </div>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}>
            <div style={{
              padding: "8px 16px",
              background: colors.glass,
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              fontSize: 14,
              color: colors.textSecondary,
            }}>
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="main-content fadeIn" style={{
          flex: 1,
          padding: 32,
          overflow: "auto",
          background: "transparent",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;