const Layout = ({ children }) => {
  return (
    <div style={{
  display: "flex",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  background: "linear-gradient(135deg, #0f172a, #1e3a8a, #3b82f6)",
}}>
      
      {/* LEFT SIDEBAR */}
      <aside style={{
        width: "260px",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(14px)",
        borderRight: "1px solid rgba(255,255,255,0.15)",
        padding: "30px 20px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: "25px",
      }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: "700",
        }}>
          🪙 Dashboard
        </h2>

        <nav style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          fontSize: "18px",
        }}>
          <button style={navBtn}>Home</button>
          <button style={navBtn}>Budget</button>
          <button style={navBtn}>Insights</button>
          <button style={navBtn}>AI Coach</button>
          <button style={navBtn}>Settings</button>
        </nav>
      </aside>


      {/* MAIN CONTENT */}
      <main style={{
  flex: 1,
  padding: "40px",
  overflowY: "auto",
  background: "transparent",
  minHeight: "100vh"
}}>

        {children}
      </main>

    </div>
  );
};

const navBtn = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "white",
  padding: "12px 15px",
  borderRadius: "10px",
  textAlign: "left",
  fontSize: "16px",
  cursor: "pointer",
  transition: "0.2s",
};

export default Layout;
