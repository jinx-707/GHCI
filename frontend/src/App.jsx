import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { ThemeProvider } from "./context/ThemeContext";

import Home from "./pages/Home";
import Budget from "./pages/Budget";
import Insights from "./pages/Insights";
import Coach from "./pages/Coach";
import Settings from "./pages/Settings";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/coach" element={<Coach />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
