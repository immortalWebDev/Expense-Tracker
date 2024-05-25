// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./Logout.css"; // Import the CSS file

// const Logout = () => {
//   const navigate = useNavigate();

  

//   return (
//     <button className="logout-button" onClick={handleLogout}>
//       Logout
//     </button>
//   );
// };

// export default Logout;





// import React, { useContext } from "react";
// import { AuthContext } from "./AuthContext";
// import "./Logout.css"; // Import the CSS file

// const Logout = () => {
//   const { logout } = useContext(AuthContext);

//   const handleLogout = () => {
//     logout();
//   };

//   return (
//     <button className="logout-button" onClick={handleLogout}>
//       Logout
//     </button>
//   );
// };

// export default Logout;






import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./Logout.css"; // Import the CSS file

const Logout = () => {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate("/signup");
  };

  return (
    <button className="logout-button" onClick={onLogout}>
      Logout
    </button>
  );
};

export default Logout;
