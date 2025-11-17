import { useState } from "react";

const BudgetForm = () => {
  const [income, setIncome] = useState("");
  const [goal, setGoal] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Income: ₹${income}\nSavings Goal: ₹${goal}`);
  };

  return (
    <div
      style={{
        background: "white",
        padding: "30px",
        marginTop: "30px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        animation: "fadeIn 0.6s ease",
      }}
    >
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        💸 Monthly Budget Setup
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div>
          <label style={{ fontWeight: "bold" }}>Monthly Income (₹)</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            style={{
              padding: "12px",
              width: "100%",
              borderRadius: "10px",
              border: "1px solid #ccc",
              marginTop: "5px",
              fontSize: "16px",
            }}
            required
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold" }}>Savings Goal (₹)</label>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{
              padding: "12px",
              width: "100%",
              borderRadius: "10px",
              border: "1px solid #ccc",
              marginTop: "5px",
              fontSize: "16px",
            }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "10px",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#45a049")}
          onMouseOut={(e) => (e.target.style.background = "#4CAF50")}
        >
          Save Budget
        </button>
      </form>

      {/* Small fade-in animation */}
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

export default BudgetForm;
