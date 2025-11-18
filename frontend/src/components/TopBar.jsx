import React from "react";
import { useTheme } from "../context/ThemeContext";

const TopBar = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        padding: "14px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background:
          theme === "light"
            ? "rgba(255,255,255,0.7)"
            : "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        borderBottom:
          theme === "light"
            ? "1px solid rgba(0,0,0,0.08)"
            : "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>
        FinCoach
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* SEARCH */}
        <input
          placeholder="Search..."
          style={{
            padding: "10px 14px",
            width: 250,
            borderRadius: 12,
            border: "none",
            background:
              theme === "light"
                ? "#f1f5f9"
                : "rgba(255,255,255,0.12)",
            color: theme === "light" ? "#1e293b" : "white",
          }}
        />

        {/* NOTIFICATION ICON */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background:
              theme === "light"
                ? "#eef2ff"
                : "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          🔔
        </div>
      </div>
    </div>
  );
};

export default TopBar;
