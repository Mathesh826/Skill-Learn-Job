import React from "react";
import { FaUserEdit, FaBookOpen, FaBriefcase } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import "../styles/user.css";
import logo from "../assets/logo3.svg";

const UserNavbar = ({ onLogout, setShowProfilePanel, setActiveSection }) => {


  // Ripple Animation
  const addRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");

    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
  };

  const handleLogout = (e) => {
    addRipple(e);
    if (onLogout) {
      onLogout();
    } else {
      localStorage.setItem("logout_success", "true");
      window.location.href = "/";
    }
  };

  return (
    <nav className="user-Navbar">

      {/* LEFT — LOGO */}
      <div className="logo-box">
        <img src={logo} alt="User Logo" className="logo-img" />
      </div>

      {/* RIGHT — BUTTONS */}
      <div className="nav-actions">

        <button
          className="nav-btn"
          onClick={(e) => {
            addRipple(e);
            if (setShowProfilePanel) setShowProfilePanel(true); // open panel
          }}
        >
          <FaUserEdit className="icon" />
          Create Profile
        </button>

        <button
          className="nav-btn"
          onClick={(e) => addRipple(e)}
        >
          <FaBookOpen className="icon" />
          Courses
        </button>

        <button
          className="nav-btn"
          onClick={(e) => {
            addRipple(e);
            setActiveSection("jobs");   // ⭐ switch page
          }}
        >
          <FaBriefcase className="icon" />
          Your Jobs
        </button>


        <button
          className="nav-btn logout-btn"
          onClick={handleLogout}
        >
          <FiLogOut className="icon" />
          Logout
        </button>

      </div>
    </nav>
  );
};

export default UserNavbar;
