// import React, { createContext, useState, useEffect } from 'react';

// // Create the AuthContext
// const AuthContext = createContext();

// // Create a provider component
// const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);

//   useEffect(() => {
//     // Check if the user is authenticated based on the token in localStorage
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsAuthenticated(true);
//     } else {
//       setIsAuthenticated(false);
//     }

//      // Shorter syntax
//     //  const token = localStorage.getItem('token');
//     //  setIsAuthenticated(!!token);
//   }, []);

//   const handleLogin = () => {
//     // Simulate successful authentication
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     // Remove the token from local storage
//     localStorage.removeItem("token");
//     localStorage.removeItem("userEmail");
//     setIsAuthenticated(false);
//     // We will handle navigation in the component that calls this
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, handleLogout,handleLogin ,setIsAuthenticated}}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContext, AuthProvider };


