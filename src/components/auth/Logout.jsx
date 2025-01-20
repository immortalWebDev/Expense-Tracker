import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slice/authSlice";
import "./Logout.css"; 

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    
    navigate("/signup");
    window.location.reload();

    console.log('Logged out successfully')
  };

  return (
    <button className="logout-button" onClick={onLogout}>
      Logout
    </button>
  );
};

export default Logout;
