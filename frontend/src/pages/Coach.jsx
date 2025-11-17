import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const NeonBubble = ({ isUser, children, theme }) => {
  const base = { padding: "12px 16px", borderRadius: 16, maxWidth: "78%", display: "inline-block", fontWeight:500 };
  if (isUser) {
    return <div style={{ ...base, background: "linear-gradient(90deg,#7c3aed,#a855f7)", color: "white", boxShadow: "0 10px 40px rgba(124,58,237,0.18)" }}>{children}</div>;
  }
  return <div style={{ ...base, background: theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)", color: theme === "light" ? "#1e293b" : "white", border: theme === "light" ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.08)" }}>{children}</div>;
};

const Coach = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([{ sender: "ai", text: "Hello — I'm FinCoach. Ask me about budgets, savings or spending trends!" }]);
  const [input, setInput] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  const generateAIReply = (txt) => {
    const t = txt.toLowerCase();
    if (t.includes("save")) return { sender: "ai", text: "Try automating 20% of income — let savings grow silently." };
    if (t.includes("dining")) return { sender: "ai", text: "Try cooking 2 meals/week — saves ₹800+/mo." };
    return { sender: "ai", text: "Tell me more — what's your monthly habit?" };
  };

  const send = () => {
    if (!input.trim()) return;
    const user = { sender: "user", text: input };
    setMessages((s) => [...s, user]);
    setInput("");
    setTimeout(() => setMessages((s) => [...s, generateAIReply(input)]), 550);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: theme === "light" ? "#1e293b" : "white", fontWeight:800 }}>🤖 Neon AI Coach</h2>

      <div ref={boxRef} style={{
        height: "62vh",
        borderRadius: 20,
        padding: 18,
        overflowY: "auto",
        background: theme === "light" ? "linear-gradient(135deg,#fff,#f7f5ff)" : "linear-gradient(135deg,rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
        boxShadow: theme === "light" ? "0 10px 40px rgba(16,24,40,0.04)" : "0 10px 40px rgba(0,0,0,0.5)",
        border: theme === "light" ? "1px solid rgba(0,0,0,0.04)" : "1px solid rgba(255,255,255,0.06)"
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 12, display: "flex", justifyContent: m.sender === "user" ? "flex-end" : "flex-start" }}>
            <NeonBubble isUser={m.sender === "user"} theme={theme}>{m.text}</NeonBubble>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask FinCoach..." style={{
          flex:1, padding:"12px 14px", borderRadius:14, border:"none", background: theme === "light" ? "#f3f4f6" : "rgba(255,255,255,0.04)", color: theme === "light" ? "#1e293b" : "white"
        }} />
        <button onClick={send} style={{ padding:"12px 16px", borderRadius:14, border:"none", background:"linear-gradient(90deg,#7c3aed,#a855f7)", color:"white", fontWeight:700 }}>Send</button>
      </div>
    </div>
  );
};

export default Coach;
