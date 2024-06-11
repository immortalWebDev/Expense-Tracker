import React, { createContext, useContext, useState,useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const storedTheme = localStorage.getItem('theme');

  const [theme, setTheme] = useState(storedTheme || 'light'); // default theme

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    // setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    setTheme(newTheme)
    localStorage.setItem('theme',newTheme)
  };

  //Bottom root strip bg made dynamic
  useEffect(() => {
    document.getElementById('root').className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


