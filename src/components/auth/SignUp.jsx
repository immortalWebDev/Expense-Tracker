import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { login } from "../../store/slice/authSlice";
import { useTheme } from "../misc/ThemeContext";
import "./SignUp.css";

const SignUp = () => {
  const { theme } = useTheme();

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

    // console.log(`${import.meta.env.VITE_FB_SIGNIN}${import.meta.env.VITE_FB_API}`)
    

    let url;
    if (isLogin) {
      url = `${import.meta.env.VITE_FB_SIGNIN}${import.meta.env.VITE_FB_API}`;
    } else {
      url = `${import.meta.env.VITE_FB_SIGNUP}${import.meta.env.VITE_FB_API}`;
    }

    try {
      const response = await axios.post(url, {
        email,
        password,
        returnSecureToken: true,
      });

      const data = response.data;

      // console.log("Data fetched from server upon successfull auth", data);

      // Dispatch login action with user's email
      dispatch(login({ email: data.email, token: data.idToken }));

      localStorage.setItem("refreshToken", data.refreshToken); // Store refresh token
      localStorage.setItem("tokenExpiry", Date.now() + data.expiresIn * 1000);

      setError(null);
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/home");
      // window.location.reload(); //to show theme button

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
        `${import.meta.env.VITE_FB_PASSWORD_RESET}${import.meta.env.VITE_FB_API}`,
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
            <button
              type="button"
              className="small-button"
              onClick={toggleLogin}
            >
              {isLogin
                ? "Create a new account"
                : "Log in with existing account"}
            </button>
          </div>
        </form>
      </div>
      <div></div>
    </div>
  );
};

export default SignUp;
