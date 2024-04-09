import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "./../img/Logo.png";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import "./../styles/navbar.css";

const Navbar = () => {
  let location = useLocation();
  const token = localStorage.getItem("token");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActiveLink = (pathname) => {
    return location.pathname === pathname ? "activeLink" : "";
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };
  const styles={
      navbar: {
        top: 0, 
        position:'fixed',
        
      },
  }

  return (
    <nav className="navbar" style={styles.navbar}>
      <div className="container">
        <div className="logoContainer">
          <img src={logo} alt="Cricket Logo" className="logoImage" />
        </div>
        <div className="navbarLinks">
          <Link
            className={`navLink ${isActiveLink("/")}`}
            to="/"
          >
            Home
          </Link>
          <Link
            className={`navLink ${isActiveLink("/about")}`}
            to="/about"
          >
            About
          </Link>
          <Link
            className={`navLink ${isActiveLink("/mymatches")}`}
            to="/mymatches"
          >
            My Matches
          </Link>
          <div className="dropdownContainer">
            <span
              className="navLink accountLink"
              onClick={handleDropdownToggle}
            >
              Account{" "}
              {dropdownOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </span>
            {dropdownOpen && (
              <div
                className="dropdownMenu"
                onMouseLeave={handleDropdownClose}
              >
                <Link
                  className={`dropdownLink ${isActiveLink("/myaccount")}`}
                  to="/myaccount"
                >
                  My Account
                </Link>
                <Link
                  className={`dropdownLink ${isActiveLink("/mymembership")}`}
                  to="/mymembership"
                >
                  Membership
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="linksContainer">
          {token ? (
            <Link className="button" to="/login" role="button"
            onClick={handleLogout}>
            Logout
          </Link>
          ) : (
            <form className="form">
              {location.pathname !== "/login" && (
                <Link className="button" to="/login" role="button">
                  Login
                </Link>
              )}
              {location.pathname !== "/signup" && (
                <Link className="button" to="/signup" role="button">
                  Signup
                </Link>
              )}
            </form>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

