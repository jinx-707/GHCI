import React from "react";
import { useTheme } from "../context/ThemeContext";

const TopBar = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        width: "100%",
        padding: "14px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: theme === "light" ? "#ffffffcc" : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
        color: theme === "light" ? "#0f172a" : "white",
        borderBottom:
          theme === "light"
            ? "1px solid rgba(0,0,0,0.06)"
            : "1px solid rgba(255,255,255,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700 }}>FinCoach</div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <input
          placeholder="Search transactions, categories..."
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "none",
            width: 300,
            background: theme === "light" ? "#f1f5f9" : "rgba(255,255,255,0.06)",
            color: theme === "light" ? "#1e293b" : "white",
          }}
        />

        <div
          title="Notifications"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: theme === "light" ? "#f1f5f9" : "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          🔔
        </div>
      </div>
    </div>
  );
};

export default TopBar;
