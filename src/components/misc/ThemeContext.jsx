import React, { createContext, useContext, useState,useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const storedTheme = localStorage.getItem('theme');

  const [theme, setTheme] = useState(storedTheme || 'light'); // default theme

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme)
    localStorage.setItem('theme',newTheme)
  };
 
  // Bottom root strip bg made dynamic (so that theme applied globally)
  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.className = theme;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


