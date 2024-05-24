import React from 'react';
import './App.css';
import SignUp from './components/SignUp';


function App() {

  
  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar">
          <div className="navbar-left">
            <div className="logo">ExpenseEagle!</div>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#about">About Us</a></li>
            </ul>
          </div>
        </nav>
      </header>
      <main>
        <SignUp />
      </main>
    </div>
  );
}

export default App;
