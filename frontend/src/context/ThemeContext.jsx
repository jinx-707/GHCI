import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const themes = {
  light: {
    bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
    cardBg: "rgba(255, 255, 255, 0.9)",
    sidebarBg: "rgba(255, 255, 255, 0.95)",
    text: "#0f172a",
    textSecondary: "#64748b",
    border: "rgba(0, 0, 0, 0.08)",
    shadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    accent: "#6366f1",
    accentHover: "#4f46e5",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    glass: "rgba(255, 255, 255, 0.1)"
  },
  dark: {
    bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    cardBg: "rgba(30, 41, 59, 0.8)",
    sidebarBg: "rgba(15, 23, 42, 0.9)",
    text: "#f8fafc",
    textSecondary: "#94a3b8",
    border: "rgba(255, 255, 255, 0.1)",
    shadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    accent: "#60a5fa",
    accentHover: "#3b82f6",
    success: "#34d399",
    warning: "#fbbf24",
    error: "#f87171",
    glass: "rgba(255, 255, 255, 0.05)"
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ghci-theme');
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('ghci-theme', theme);
    const currentTheme = themes[theme];
    
    Object.entries(currentTheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
    
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  
  const getThemeColors = () => themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, getThemeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};