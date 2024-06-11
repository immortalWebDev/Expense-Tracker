import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Navigate,
} from "react-router-dom";
import "./App.css";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import ExpenseTracker from "./components/ExpenseTracker";
import PrivateRoute from "./components/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuthenticated } from "./store/authSlice";
import { ThemeProvider,useTheme } from "./store/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";



function App() {

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const { theme } = useTheme();
  const totalAmount = useSelector(state => state.expenses.totalAmount);



  useEffect(() => {
    const token = localStorage.getItem('token');
    dispatch(setIsAuthenticated(!!token));
  }, [dispatch]);

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
              {totalAmount >= 10000 && (
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
          <Routes>
            <Route path="/home" element={<PrivateRoute element={Home} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/expenses" element={<PrivateRoute element={ExpenseTracker} />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/signup"} />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default () => (
  <ThemeProvider>

  <Router>
    <App />
  </Router>
  </ThemeProvider>

);