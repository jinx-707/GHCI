import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const wrapper = {
  display: "grid",
  gap: 24,
  padding: 20,
  maxWidth: 980,
  margin: "0 auto",
};

const section = (theme) => ({
  padding: 22,
  borderRadius: 16,
  background: "var(--card-bg)",
  border: theme === "light" ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)",
});

const leaderboardSample = [
  { name: "You", score: 920, medal: "🥇", glow: true },
  { name: "Arjun", score: 840, medal: "🥈" },
  { name: "Aisha", score: 790, medal: "🥉" },
  { name: "Ravi", score: 640 },
  { name: "Megha", score: 580 },
];

const Settings = () => {
  const { theme, setTheme, accent, setAccent } = useTheme();
  const [language, setLanguage] = useState("English");
  const [offline, setOffline] = useState(false);
  const [quiz, setQuiz] = useState("");
  const accentOptions = ["#7c3aed", "#3b82f6", "#16a34a", "#ec4899", "#f97316"];

  return (
    <div style={wrapper}>
      <div style={section(theme)}>
        <h2 style={{ margin: 0 }}>Profile</h2>
        <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 12,
            background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
            display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800
          }}>B</div>

          <div>
            <div style={{ fontWeight: 800 }}>Brown</div>
            <div style={{ opacity: 0.7 }}>Premium • Offline</div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div style={section(theme)}>
        <h2 style={{ margin: 0 }}>Appearance</h2>
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button onClick={() => setTheme("light")} style={{
            flex: 1, padding: 12, borderRadius: 12,
            background: theme === "light" ? accent : "transparent",
            color: theme === "light" ? "white" : "var(--text)", fontWeight: 700, border: theme === "light" ? `2px solid ${accent}` : "1px solid rgba(0,0,0,0.06)"
          }}>Light Mode</button>

          <button onClick={() => setTheme("dark")} style={{
            flex: 1, padding: 12, borderRadius: 12,
            background: theme === "dark" ? accent : "transparent",
            color: "white", fontWeight: 700, border: theme === "dark" ? `2px solid ${accent}` : "1px solid rgba(0,0,0,0.06)"
          }}>Dark Mode</button>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, opacity: 0.75 }}>Accent color</div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            {accentOptions.map(col => (
              <div key={col} onClick={() => setAccent(col)} style={{
                width: 36, height: 36, borderRadius: 10, background: col,
                cursor: "pointer", boxShadow: accent === col ? `0 0 20px ${col}` : "none", border: accent === col ? `2px solid ${col}55` : "1px solid rgba(0,0,0,0.06)"
              }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Language + Offline */}
      <div style={section(theme)}>
        <h2 style={{ margin: 0 }}>Language & Offline</h2>
        <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
          <select value={language} onChange={(e)=>setLanguage(e.target.value)} style={{ padding: 10, borderRadius: 10 }}>
            <option>English</option>
            <option>Hindi</option>
            <option>Kannada</option>
            <option>Spanish</option>
          </select>

          <label style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={offline} onChange={(e)=>setOffline(e.target.checked)} />
            <span style={{ opacity: 0.8 }}>Offline Mode</span>
          </label>
        </div>
        <div style={{ marginTop: 8, opacity: 0.7 }}>When enabled, the app will use cached data.</div>
      </div>

      {/* Quiz */}
      <div style={section(theme)}>
        <h2 style={{ margin: 0 }}>Personalization Quiz — Q1</h2>
        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {["Very carefully","Moderately","Freely","Impulsively"].map(opt => (
            <button key={opt} onClick={() => setQuiz(opt)} style={{
              padding: 12, borderRadius: 10, border: quiz===opt ? `2px solid ${accent}` : "1px solid rgba(0,0,0,0.06)",
              background: quiz===opt ? accent : "transparent", color: quiz===opt ? "white" : "var(--text)", fontWeight: 700
            }}>{opt}</button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div style={section(theme)}>
        <h2 style={{ margin: 0 }}>Leaderboard</h2>
        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {leaderboardSample.map((p, idx) => (
            <div key={idx} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12,
              borderRadius: 10, background: p.glow ? `linear-gradient(135deg, ${accent}, ${accent}66)` : "transparent", boxShadow: p.glow ? `0 8px 24px ${accent}55` : "none"
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontSize: 18 }}>{p.medal || "•"}</div>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
              </div>
              <div style={{ fontWeight: 800 }}>{p.score} XP</div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div style={section(theme)}>
        <h2 style={{ margin: 0 }}>Privacy & Security</h2>
        <div style={{ marginTop: 8, opacity: 0.8 }}>
          Your data is encrypted and securely stored. Masked Data: ****1234
        </div>
        <div style={{ marginTop: 12 }}>
          <button style={{ padding: 12, borderRadius: 10, background: accent, color: "white", border: "none", fontWeight: 700 }}>
            View Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
