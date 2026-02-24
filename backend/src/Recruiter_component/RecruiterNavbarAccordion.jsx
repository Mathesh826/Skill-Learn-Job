import { useState, useRef, useEffect } from "react";
import {
  FaBriefcase,
  FaUsers,
  FaChartLine,
  FaBuilding
} from "react-icons/fa";
import "../styles/Recruiterpage.css";

const RecruiterNavbarAccordion = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [panelStyle, setPanelStyle] = useState({});
  const navRef = useRef(null);

  const toggleTab = (tab, event) => {
  if (activeTab === tab) {
    setActiveTab(null);
    return;
  }

  const buttonRect = event.currentTarget.getBoundingClientRect();
  const panelWidth = Math.max(buttonRect.width, 320);
  const gap = 18;

  // 🔒 Keep panel inside viewport
  const maxLeft = window.innerWidth - panelWidth - 16;
  const safeLeft = Math.min(buttonRect.left, maxLeft);

  setPanelStyle({
    top: `${buttonRect.bottom + gap}px`,
    left: `${Math.max(safeLeft, 16)}px`,
    width: `${panelWidth}px`
  });

  setActiveTab(tab);
};

  /* 🔹 AUTO CLOSE ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveTab(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="recruiter-nav-fixed" ref={navRef}>

      {/* 🔹 NAV BUTTONS */}
      <div className="recruiter-nav-cards">
        <button
          className={`nav-card ${activeTab === "jobs" ? "active" : ""}`}
          onClick={(e) => toggleTab("jobs", e)}
          data-tooltip="Post and manage job openings"
        >
          <FaBriefcase />
          <span>Jobs</span>
        </button>

        <button
          className={`nav-card ${activeTab === "applicants" ? "active" : ""}`}
          onClick={(e) => toggleTab("applicants", e)}
          data-tooltip="View and shortlist applicants"
        >
          <FaUsers />
          <span>Applicants</span>
        </button>

        <button
          className={`nav-card ${activeTab === "analytics" ? "active" : ""}`}
          onClick={(e) => toggleTab("analytics", e)}
          data-tooltip="Track recruitment performance"
        >
          <FaChartLine />
          <span>Analytics</span>
        </button>

        <button
          className={`nav-card ${activeTab === "company" ? "active" : ""}`}
          onClick={(e) => toggleTab("company", e)}
          data-tooltip="Manage company profile"
        >
          <FaBuilding />
          <span>Company</span>
        </button>
      </div>

      {/* 🔹 DROPDOWN PANEL (POSITIONED UNDER CLICKED BUTTON) */}
      <div
        className={`nav-info-panel ${activeTab ? "open" : ""}`}
        style={panelStyle}
      >
        {activeTab === "jobs" && (
          <p>Post job openings with skills, experience, and role details to attract qualified candidates.</p>
        )}
        {activeTab === "applicants" && (
          <p>Shortlist, review, and manage applicants efficiently from your recruiter dashboard.</p>
        )}
        {activeTab === "analytics" && (
          <p>Analyze job reach, applicant flow, and hiring success using analytics.</p>
        )}
        {activeTab === "company" && (
          <p>Keep company information updated to improve visibility and candidate trust.</p>
        )}
      </div>

    </div>
  );
};

export default RecruiterNavbarAccordion;
