import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { ThemeProvider } from "./context/ThemeContext";

import Home from "./pages/Home";
import Budget from "./pages/Budget";
import Insights from "./pages/Insights";
import Coach from "./pages/Coach";
import Settings from "./pages/Settings";
import Lifestyle from "./pages/Lifestyle";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/coach" element={<Coach />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/lifestyle" element={<Lifestyle />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;