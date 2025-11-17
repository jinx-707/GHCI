const ProgressCard = () => {
  const percent = 70; // fake data for now

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
      <h3 style={{ marginBottom: "10px" }}>Savings Progress</h3>

      <div
        style={{
          width: "100%",
          height: "15px",
          background: "#ddd",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#4CAF50",
            borderRadius: "10px",
            transition: "0.5s",
          }}
        ></div>
      </div>

      <p style={{ marginTop: "10px", fontWeight: "bold" }}>{percent}% Achieved</p>
    </div>
  );
};

export default ProgressCard;
