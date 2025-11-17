const InsightCard = () => {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "25px",
        borderRadius: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <h3 style={{ marginBottom: "10px" }}>AI Insights 🤖</h3>

      <p style={{ fontSize: "16px", color: "#555" }}>
        Cutting your dining expenses by 10% could save you ₹500 monthly!  
        Keep going — you're doing amazing. 💚📈
      </p>
    </div>
  );
};

export default InsightCard;
