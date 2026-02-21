import { useState } from "react";
import { FaUserCircle, FaSearch, FaBuilding, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoginPanel from "./LoginPanel";

function Sidebar() {
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();

  // Toggle login panel
  const handleLoginClick = () => {
    setOpenLogin(prev => !prev);
  };

  // Close when clicking outside
  const closePanel = () => {
    setOpenLogin(false);
  };

  // ✅ Recruiter page navigation
  const handleRecruiterClick = () => {
    closePanel();                 // close user login if open
    navigate("/recruiter-login"); // go to recruiter login page
  };

  return (
    <>
      {/* PAGE OVERLAY */}
      {openLogin && (
        <div className="login-overlay" onClick={closePanel}></div>
      )}

      <aside className="side-bar">
        <div className="side-item" onClick={handleLoginClick}>
          <FaUserCircle />
          <span>Login</span>
        </div>

        <div className="side-item">
          <FaSearch />
          <span>Search</span>
        </div>

        {/* ✅ UPDATED RECRUITERS ICON */}
        <div className="side-item" onClick={handleRecruiterClick}>
          <FaBuilding />
          <span>Recruiters</span>
        </div>

        <div className="side-item">
          <FaCog />
          <span>Settings</span>
        </div>
      </aside>

      {/* LOGIN PANEL */}
      <div onClick={(e) => e.stopPropagation()}>
        <LoginPanel isOpen={openLogin} onClose={closePanel} />
      </div>
    </>
  );
}

export default Sidebar;
