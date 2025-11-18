import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const { theme, toggleTheme, accent, setAccent } = useTheme();

  // ---------------------------
  // PERSONALIZATION QUIZ DATA
  // ---------------------------
  const quizQuestions = [
    {
      question: "How do you usually spend money?",
      options: ["Very carefully", "Moderately", "Freely", "Impulsively"],
    },
    {
      question: "What’s your biggest financial goal right now?",
      options: ["Savings", "Investing", "Debt-free", "Travel"],
    },
    {
      question: "How often do you track your spending?",
      options: ["Daily", "Weekly", "Monthly", "Never"],
    },
    {
      question: "How comfortable are you with financial risks?",
      options: ["Low", "Moderate", "High", "Very High"],
    },
    {
      question: "Which area do you struggle with the most?",
      options: ["Overspending", "Saving", "Budgeting", "Investing"],
    },
  ];

  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleQuizSelect = (option) => {
    const newAnswers = [...answers];
    newAnswers[quizStep] = option;
    setAnswers(newAnswers);

    if (quizStep < 4) setQuizStep(quizStep + 1);
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setAnswers([]);
  };

  // ---------------------------
  // LEADERBOARD DATA
  // ---------------------------
  const leaderboard = [
    { name: "Ava", score: 1280, rank: 1 },
    { name: "Aarav", score: 1120, rank: 2 },
    { name: "Maya", score: 960, rank: 3 },
    { name: "Karan", score: 840, rank: 4 },
    { name: "Sara", score: 790, rank: 5 },
  ];

  const getMedal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "⭐";
  };

  const accents = ["#7c3aed", "#2563eb", "#059669", "#f43f5e", "#f59e0b"];

  return (
    <div
      style={{
        padding: 30,
        minHeight: "100vh",
        background:
          theme === "light"
            ? "linear-gradient(135deg,#f8fafc,#eef2ff)"
            : "linear-gradient(135deg,#0f172a,#1e3a8a,#3b82f6)",
      }}
    >
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 20 }}>
        Settings
      </h1>

      {/* PROFILE */}
      <section
        style={{
          padding: 22,
          borderRadius: 20,
          background: theme === "light" ? "white" : "rgba(255,255,255,0.06)",
          marginBottom: 20,
        }}
      >
        <h2 style={{ marginBottom: 15 }}>Profile</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              background: accent,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            B
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Ava</div>
            <div style={{ opacity: 0.7 }}>Premium • Offline</div>
          </div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section
        style={{
          padding: 22,
          borderRadius: 20,
          background: theme === "light" ? "white" : "rgba(255,255,255,0.06)",
          marginBottom: 20,
        }}
      >
        <h2 style={{ marginBottom: 12 }}>🏆 Leaderboard</h2>

        {leaderboard.map((user) => (
          <div
            key={user.rank}
            style={{
              padding: 14,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
              background:
                user.rank === 1
                  ? accent
                  : theme === "light"
                  ? "#f1f5f9"
                  : "rgba(255,255,255,0.04)",
              color: user.rank === 1 ? "white" : theme === "light" ? "#1e293b" : "white",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 20 }}>{getMedal(user.rank)}</div>
              <div>
                <div style={{ fontWeight: 700 }}>{user.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{user.score} XP</div>
              </div>
            </div>

            <div
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                background: "rgba(0,0,0,0.15)",
                color: "white",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              #{user.rank}
            </div>
          </div>
        ))}
      </section>

      {/* APPEARANCE */}
      <section
        style={{
          padding: 22,
          borderRadius: 20,
          background: theme === "light" ? "white" : "rgba(255,255,255,0.06)",
          marginBottom: 20,
        }}
      >
        <h2>Appearance</h2>

        <div
          style={{
            marginTop: 15,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <button
            onClick={() => theme !== "light" && toggleTheme()}
            style={{
              padding: "10px 20px",
              background: theme === "light" ? accent : "rgba(0,0,0,0.1)",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Light Mode
          </button>

          <button
            onClick={() => theme !== "dark" && toggleTheme()}
            style={{
              padding: "10px 20px",
              background: theme === "dark" ? accent : "rgba(0,0,0,0.1)",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Dark Mode
          </button>
        </div>

        <p style={{ marginTop: 20, fontWeight: 600 }}>Accent Color</p>

        <div style={{ display: "flex", gap: 12 }}>
          {accents.map((c) => (
            <div
              key={c}
              onClick={() => setAccent(c)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: c,
                cursor: "pointer",
                outline: c === accent ? "3px solid white" : "none",
              }}
            />
          ))}
        </div>
      </section>

      {/* LANGUAGE + OFFLINE */}
      <section
        style={{
          padding: 22,
          borderRadius: 20,
          background: theme === "light" ? "white" : "rgba(255,255,255,0.06)",
          marginBottom: 20,
        }}
      >
        <h2>Language & Offline Mode</h2>

        <label style={{ fontWeight: 600 }}>Language</label>
        <br />
        <select
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
            width: 200,
          }}
        >
          <option>English</option>
        </select>

        <div style={{ marginTop: 20 }}>
          <input type="checkbox" id="offline" />
          <label htmlFor="offline" style={{ marginLeft: 10 }}>
            Enable Offline Mode
          </label>
        </div>
      </section>

      {/* QUIZ */}
      <section
        style={{
          padding: 22,
          borderRadius: 20,
          background: theme === "light" ? "white" : "rgba(255,255,255,0.06)",
          marginBottom: 20,
        }}
      >
        <h2>Personalization Quiz</h2>
        <p style={{ opacity: 0.7, marginBottom: 10 }}>
          Question {quizStep + 1} of 5
        </p>

        <h3
          style={{
            marginBottom: 14,
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {quizQuestions[quizStep].question}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {quizQuestions[quizStep].options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleQuizSelect(opt)}
              style={{
                padding: "12px 16px",
                background: accent,
                color: "white",
                border: "none",
                borderRadius: 12,
                textAlign: "left",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {quizStep === 4 && (
          <button
            onClick={resetQuiz}
            style={{
              marginTop: 20,
              padding: "12px 18px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 600,
            }}
          >
            Restart Quiz
          </button>
        )}
      </section>

      {/* PRIVACY */}
      <section
        style={{
          padding: 22,
          borderRadius: 20,
          background: theme === "light" ? "white" : "rgba(255,255,255,0.06)",
        }}
      >
        <h2>Privacy & Security</h2>
        <p style={{ opacity: 0.7 }}>
          Your data is encrypted and securely stored. We never share your
          personal information.
        </p>

        <button
          style={{
            marginTop: 14,
            padding: "10px 20px",
            borderRadius: 10,
            background: accent,
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          View Privacy Policy
        </button>
      </section>
    </div>
  );
};

export default Settings;
