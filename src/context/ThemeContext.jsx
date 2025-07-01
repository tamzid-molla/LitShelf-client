import { createContext, useEffect, useState } from "react";

// Create a context to manage theme (light/dark)
export const ThemContext = createContext('light');

export const ThemeContext = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [manualOverride, setManualOverride] = useState(() => {
    return localStorage.getItem('theme') !== null; 
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      if (!manualOverride) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [manualOverride]);

 
  const toggleDarkMode = () => {
    setManualOverride(true); 
    setDarkMode(prev => !prev);
  };

  return (
    <ThemContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemContext.Provider>
  );
};
