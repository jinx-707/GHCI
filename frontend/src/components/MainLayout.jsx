const MainLayout = ({ children }) => {
  return (
    <div style={{
      maxWidth: "700px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial",
    }}>
      {children}
    </div>
  );
};

export default MainLayout;
