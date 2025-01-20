import { NavLink } from "react-router-dom";
import Logout from "../auth/Logout";
import { useSelector } from "react-redux";
import "./Navbar.css";

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <NavLink to="/home">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2344/2344132.png"
              alt="logo"
              width="25px"
            />{" "}
            ExpenseEagle!
          </NavLink>
        </div>

        {isAuthenticated && <Logout />}
      </div>
    </nav>
  );
};

export default Navbar;
