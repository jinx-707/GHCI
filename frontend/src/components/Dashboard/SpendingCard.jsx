const SpendingCard = () => {
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
      <h3 style={{ marginBottom: "10px" }}>Monthly Spending</h3>

      <p style={{ fontSize: "16px", color: "#555" }}>
        Dining: ₹1200 <br />
        Shopping: ₹2600 <br />
        Groceries: ₹1800 <br />
      </p>
    </div>
  );
};

export default SpendingCard;
