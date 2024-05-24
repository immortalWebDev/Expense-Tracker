import React from "react";
import { BrowserRouter as Router, Route, Routes, NavLink} from "react-router-dom";
import "./App.css";
import SignUp from "./components/SignUp";
import Home from "./components/Home";

function App() {
  
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="navbar">
            <div className="navbar-left">
              <div className="logo">ExpenseEagle!</div>
              <ul>
                <li>
                <NavLink to="/home" end activeclassname="active">Home</NavLink>
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
            <Route path="/" element={<SignUp />}></Route>
            <Route path="/home" element={<Home />}></Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
