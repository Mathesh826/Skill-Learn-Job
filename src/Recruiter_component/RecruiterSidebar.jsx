import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaBriefcase,
  FaUsers,
  FaHistory,
  FaCommentDots,
  FaFileContract,
  FaSignOutAlt
} from "react-icons/fa";
import "../styles/Recruiterpage.css";
import Swal from "sweetalert2";
import "animate.css";



const RecruiterSidebar = ({ onLogout }) => {
  const [recruiterName, setRecruiterName] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    // ✅ Get recruiter info from localStorage
    const recruiterData = JSON.parse(localStorage.getItem("recruiter") || "{}");
    if (recruiterData) {
      setRecruiterName(recruiterData.firstName || "");
      setCompanyName(recruiterData.company || "");
    }
  }, []);

  const handleLogout = () => {
  // 🔊 Play logout sound
  const logoutSound = new Audio("/sounds/logout.mp3");
  logoutSound.volume = 0.25;
  logoutSound.play();

  const Toast = Swal.mixin({
    toast: true,               // ✅ small alert
    position: "center",       // right corner
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,

    background: "rgba(15,23,42,0.95)",
    color: "#fff",

    customClass: {
      popup: "logout-toast"
    },

    showClass: {
      popup: "animate__animated animate__fadeInRight"
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutRight"
    }
  });

  Toast.fire({
    icon: "success",
    title: "Logged out successfully"
  }).then(() => {
    localStorage.removeItem("recruiter");
    window.location.href = "/";
  });
};



  return (
    <aside className="recruiter-sidebar">
      {/* Top Welcome */}
      <div className="sidebar-header">
        <p className="welcome-text">Welcome</p>
        <h3 className="recruiter-name">{recruiterName}</h3>
        <p className="company-name">{companyName}</p>
      </div>

      {/* Nav Links */}
      <nav className="sidebar-nav">
        <a href="#company"><FaBuilding /> Company Info</a>
        <a href="#jobs"><FaBriefcase /> Job Posting</a>
        <a href="#applicants"><FaUsers /> Applicants</a>
        <a href="#history"><FaHistory /> Application History</a>
        <a href="#feedback"><FaCommentDots /> Feedbacks</a>
        <a href="#terms"><FaFileContract /> Terms & Conditions</a>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="logout-btn-123" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
        <p className="copyright">
          © {new Date().getFullYear()} Recruiter Portal
        </p>
      </div>
    </aside>
  );
};

export default RecruiterSidebar;
