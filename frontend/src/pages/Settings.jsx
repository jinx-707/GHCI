import React from "react";
import { useTheme } from "../context/ThemeContext";

const leaderboard = [
  { name: "You", score: 920, rank: 1, color: "#facc15", medal: "🥇" },
  { name: "Riya", score: 860, rank: 2, color: "#e5e7eb", medal: "🥈" },
  { name: "Arjun", score: 780, rank: 3, color: "#b45309", medal: "🥉" },
  { name: "Sam", score: 640, rank: 4 },
  { name: "Meera", score: 540, rank: 5 }
];

const Settings = () => {
  const { theme } = useTheme();

  const cardBg = theme === "light"
    ? "#ffffff"
    : "rgba(255,255,255,0.06)";

  return (
    <div>
      <h2 style={{ fontSize: 28, marginBottom: 20 }}>⚙️ Settings</h2>

      {/* Leaderboard */}
      <div
        style={{
          background: cardBg,
          padding: 20,
          borderRadius: 20,
          boxShadow:
            theme === "light"
              ? "0 8px 28px rgba(16,24,40,0.08)"
              : "0 8px 28px rgba(0,0,0,0.5)",
          marginBottom: 30
        }}
      >
        <h3 style={{ marginBottom: 12 }}>🏆 Leaderboard</h3>

        {leaderboard.map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 10px",
              background:
                p.rank <= 3
                  ? `linear-gradient(135deg, ${p.color}55, transparent)`
                  : "transparent",
              borderRadius: 14,
              marginBottom: 6
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background:
                    p.rank <= 3 ? p.color : "rgba(255,255,255,0.1)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 22
                }}
              >
                {p.medal || "👤"}
              </div>

              <div>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div
                  style={{
                    height: 6,
                    width: 140,
                    background: "rgba(0,0,0,0.1)",
                    borderRadius: 20,
                    marginTop: 4,
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      width: `${p.score / 10}%`,
                      height: 6,
                      background: p.rank === 1 ? "#facc15" : "#6366f1"
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 20, opacity: 0.7 }}>{p.score} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
