// src/components/ThemeToggle.js
import React from 'react';
import { useTheme } from '../store/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="theme-toggle-button">
      {theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
    </button>
  );
};

export default ThemeToggle;
