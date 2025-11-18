import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("#6d28d9"); // default purple

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);

    if (theme === "light") {
      document.documentElement.style.setProperty(
        "--bg",
        "linear-gradient(135deg, #faf7ff, #fff9f3)"
      );
      document.documentElement.style.setProperty("--text", "#0f172a");
      document.documentElement.style.setProperty("--card-bg", "white");
    } else {
      document.documentElement.style.setProperty(
        "--bg",
        "linear-gradient(135deg, #0f172a, #1e3a8a, #3b82f6)"
      );
      document.documentElement.style.setProperty("--text", "white");
      document.documentElement.style.setProperty(
        "--card-bg",
        "rgba(255,255,255,0.06)"
      );
    }
  }, [theme, accent]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};
