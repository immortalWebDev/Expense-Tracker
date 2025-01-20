import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "../auth/SignUp";
import Home from "../expense-tracker/Home";
import ExpenseTracker from "../expense-tracker/ExpenseTracker";
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
