import React, { useState } from "react";

const Home = () => {
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "600px",
        padding: "35px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 25px rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.12)",
        animation: "fadeIn 0.5s ease"
      }}>

        <h2 style={{
          textAlign: "center",
          marginBottom: "25px",
          fontSize: "28px",
          fontWeight: "700"
        }}>
          💸 Track Your Budget
        </h2>

        {/* Income Input */}
        <input
          type="number"
          placeholder="Monthly Income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "18px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            fontSize: "16px",
            background: "rgba(255,255,255,0.15)",
            color: "white"
          }}
        />

        {/* Expense Input */}
        <input
          type="number"
          placeholder="Monthly Expense"
          value={expense}
          onChange={(e) => setExpense(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "22px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            fontSize: "16px",
            background: "rgba(255,255,255,0.15)",
            color: "white"
          }}
        />

        {/* Button */}
        <button
          onClick={() => alert("Budget saved!")}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            border: "none",
            fontSize: "18px",
            color: "white",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          Save Budget
        </button>
      </div>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
