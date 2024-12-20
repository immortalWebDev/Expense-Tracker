import React, { useEffect } from "react";
import { BrowserRouter as Router, NavLink } from "react-router-dom";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuthenticated } from "./store/authSlice";
import { ThemeProvider, useTheme } from "./store/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import Routes from './Routes'
import { fetchExpenses } from "./store/expensesSlice";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const { theme } = useTheme();
  const totalAmount = useSelector(state => state.expenses.totalAmount);

  useEffect(() => {
    const token = localStorage.getItem('token');
    dispatch(setIsAuthenticated(!!token)); // Double negation
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchExpenses()); //to persist amount state, (to maintain toggle btn)
  },[])
  

  

  return (
    <div className={`App ${theme}`}>
      <header className={`App-header ${theme}`}>
        <nav className="navbar">
          <div className="navbar-left">
            <div className="logo">ExpenseEagle!</div>
            <ul>
              <li>
                <NavLink to="/home" end activeclassname="active">
                  Home
                </NavLink>
              </li>
              <li>
                <a href="#products">Products</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                {isAuthenticated && totalAmount >= 10000 && (
                  <ul>
                    <ThemeToggle />
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <main className={theme}>
        {isAuthenticated === null ? (
          <div>Loading...</div>
        ) : (
          <Routes /> // Render the routes component
        )}
      </main>
    </div>
  );
};

export default () => (
  <ThemeProvider>
    <Router>
      <App />
    </Router>
  </ThemeProvider>
);
