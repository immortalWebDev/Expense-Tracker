import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";
import { AuthContext } from "./AuthContext";

function SignUp() {
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate(); // React Router hook to navigate to different routes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);


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

      const data = response.data;

      localStorage.setItem("token", data.idToken);
      localStorage.setItem("userEmail", data.email);

      handleLogin();

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

  const handleForgotPassword = async () => {
    setForgotPasswordLoading(true)
    try {
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDxRZQnGCbIbLdX0T-hMudwZE9GiRmWIIw`,
        {
          requestType: "PASSWORD_RESET",
          email: email,
        }
      );
      console.log("Password reset email sent successfully!");
      setError('Password reset email sent successfully!');
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setError("Error sending password reset email. Please enter valid email.");
    } finally {
      setForgotPasswordLoading(false)
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
          {isLoading ? "Logging in..." : isLogin ? "Log in" : "Sign up"}
        </button>
        {isLogin && (
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={isLoading}
          >
            {forgotPasswordLoading ? "Sending link..." : "Forgot Password?"}
          </button>
        )}

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
