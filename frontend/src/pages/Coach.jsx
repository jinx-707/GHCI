import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const Coach = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I'm FinCoach 🤖 — ask me about saving, budgets, or transactions." },
  ]);
  const [input, setInput] = useState("");

  const chatBoxStyle = {
    background: theme === "light" ? "white" : "rgba(255,255,255,0.04)",
    borderRadius: 24,
    padding: 18,
    height: "60vh",
    overflowY: "auto",
    boxShadow: theme === "light" ? "0 10px 30px rgba(16,24,40,0.04)" : "0 10px 30px rgba(0,0,0,0.45)",
    color: theme === "light" ? "#1e293b" : "white",
  };

  const inputStyle = {
    flex: 1,
    padding: "12px 14px",
    borderRadius: 14,
    border: "none",
    outline: "none",
    background: theme === "light" ? "#f3f4f6" : "rgba(255,255,255,0.06)",
    color: theme === "light" ? "#1e293b" : "white",
  };

  const generateAIReply = (t) => {
    const txt = t.toLowerCase();
    if (txt.includes("save")) return { sender: "ai", text: "Try automating 20% to savings and set a small weekly dining cap — works well." };
    if (txt.includes("dining") || txt.includes("food")) return { sender: "ai", text: "Dining is one of the easiest wins — cook twice a week and track specific restaurants." };
    if (txt.includes("invest")) return { sender: "ai", text: "Consider a small SIP each month — consistency beats timing." };
    return { sender: "ai", text: "Nice—tell me a little more about your spending and I’ll suggest a plan." };
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const u = { sender: "user", text: input };
    const ai = generateAIReply(input);
    setMessages((s) => [...s, u, ai]);
    setInput("");
  };

  return (
    <div style={{ padding: 20, color: theme === "light" ? "#1e293b" : "white" }}>
      <h2 style={{ marginBottom: 12 }}>🤖 AI Coach</h2>

      <div style={chatBoxStyle}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 12, textAlign: m.sender === "user" ? "right" : "left" }}>
            <div style={{
              display: "inline-block",
              padding: "10px 14px",
              borderRadius: 16,
              maxWidth: "78%",
              background: m.sender === "user" ? (theme === "light" ? "#3b82f6" : "#1d4ed8") : (theme === "light" ? "#f3f4f6" : "rgba(255,255,255,0.06)"),
              color: m.sender === "user" ? "white" : (theme === "light" ? "#1e293b" : "white"),
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about saving, budgets or trends..." style={inputStyle} />
        <button onClick={sendMessage} style={{ padding: "12px 16px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#f97316,#f59e0b)", color: "white", cursor: "pointer", fontWeight: 700 }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Coach;
