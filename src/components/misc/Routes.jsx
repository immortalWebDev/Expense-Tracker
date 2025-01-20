import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import ExpenseTracker from "./components/ExpenseTracker";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/home"
        element={isAuthenticated ? <Home /> : <Navigate to="/signup" />}
      />

      <Route path="/signup" element={<SignUp />} />

      <Route
        path="/expenses"
        element={
          isAuthenticated ? <ExpenseTracker /> : <Navigate to="/signup" />
        }
      />

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/home" : "/signup"} />}
      />
    </Routes>
  );
};

export default AppRoutes;
