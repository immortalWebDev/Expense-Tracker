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

function App() {

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem('token');
    dispatch(setIsAuthenticated(!!token));
  }, [dispatch]);

  return (
    <div className="App">
      <header className="App-header">
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
            </ul>
          </div>
        </nav>
      </header>
      <main>
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
  <Router>
    <App />
  </Router>
);