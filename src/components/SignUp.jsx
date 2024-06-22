import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import { login } from "../store/authSlice";
import { useTheme } from "../store/ThemeContext";
import "./SignUp.css";

const SignUp = () => {

  const {theme} = useTheme()
  // const location = useLocation();
  // const message = location.state?.message

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      
      
      console.log(data)

      // Dispatch login action with user's email
      dispatch(login({ email: data.email, token: data.idToken }));


    localStorage.setItem('refreshToken', data.refreshToken); // Store refresh token
    localStorage.setItem('tokenExpiry', Date.now() + data.expiresIn * 1000);

      setError(null);
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/home");
    } catch (err) {
      setError("Authentication failed: Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotPasswordLoading(true);
    try {
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDxRZQnGCbIbLdX0T-hMudwZE9GiRmWIIw`,
        {
          requestType: "PASSWORD_RESET",
          email: email,
        }
      );
      setError("Password reset email sent successfully!");
    } catch (error) {
      setError("Error sending password reset email. Please enter valid email.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const toggleLogin = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
    setError(null);
  };

  return (
    <div>
    <div className={`signup-container ${theme}`}>
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
          {isLoading ? "Loading..." : isLogin ? "Log in" : "Sign up"}
        </button>
        {isLogin && (
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={forgotPasswordLoading}
          >
            {forgotPasswordLoading ? "Sending link..." : "Forgot Password?"}
          </button>
        )}
        <div className="login-link">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button type="button" className="small-button" onClick={toggleLogin}>
            {isLogin ? "Create a new account" : "Log in with existing account"}
          </button>
        </div>
      </form>
    </div>
    <div>
    {/* {message && <p>{message}</p>} */}
    </div>
    </div>
  );
};

export default SignUp;
