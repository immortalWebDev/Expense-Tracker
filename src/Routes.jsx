import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import ExpenseTracker from "./components/ExpenseTracker";
import PrivateRoute from "./components/PrivateRoute";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route path="/home" element={<PrivateRoute element={Home} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/expenses" element={<PrivateRoute element={ExpenseTracker} />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/signup"} />} />
    </Routes>
  );
};

export default AppRoutes;
