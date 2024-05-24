import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate(); // React Router hook to navigate to different routes

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    let url;
    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDxRZQnGCbIbLdX0T-hMudwZE9GiRmWIIw`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDxRZQnGCbIbLdX0T-hMudwZE9GiRmWIIw`;
    }

    try {
      const response = await axios.post(url, {
        email,
        password,
        returnSecureToken: true,
      });

      const data = response.data
      
      localStorage.setItem('token',data.idToken)
      localStorage.setItem('userEmail',data.email)
      

      console.log("Authentication successful:", response.data);
      setError(null);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/home"); // Navigate to the Home component on successful login/signup

    } catch (err) {
      let errorMessage = "Authentication failed: Invalid credentials";
    //   if (err.response && err.response.data && err.response.data.error && err.response.data.error.message) {
    //     errorMessage = err.response.data.error.message;
    //   }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLogin = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
    setError(null);
  };

  return (
    <section className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : isLogin ? "Log in" : "Sign up"}
        </button>
        <div className="login-link">
          {isLogin ? "Don't have an account ?" : "Already have an account ?"}
          <button type="button" className="small-button" onClick={toggleLogin}>
            {isLogin ? "Create a new account" : "Log in with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default SignUp;
