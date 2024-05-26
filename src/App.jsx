import React, { useContext } from "react";
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
import { AuthContext, AuthProvider } from "./components/AuthContext";
import ExpenseTracker from "./components/ExpenseTracker";

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  console.log("login status", isAuthenticated);

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
        <Routes>
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/signup" />}
          />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/expenses" element={<ExpenseTracker />} />

        </Routes>
      </main>
    </div>
  );
}

export default () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);
