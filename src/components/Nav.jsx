import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaMoon, FaSun } from "react-icons/fa";
import logo from "../assets/logo3.svg";
//import "../styles/home.css";

function Navbar() {
  const [openItem, setOpenItem] = useState(null);
  const [theme, setTheme] = useState("dark");
  const navRef = useRef();

  /* Close on outside click */
  useEffect(() => {
    const handleOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenItem(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  /* Close on ESC */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpenItem(null);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  /* Theme toggle */
  useEffect(() => {
    document.body.className = theme === "light" ? "light-theme" : "";
  }, [theme]);

  const toggleAccordion = (item) => {
    setOpenItem(openItem === item ? null : item);
  };

  return (
    <>
      {openItem && <div className="navbar-blur"></div>}

      <nav className="navbar" ref={navRef}>
        <div className="nav-logo">
          <img src={logo} alt="Skill Nexus Logo" />
        </div>

        <ul className="nav-links">

          <li className={`nav-accordion ${openItem === "about" ? "open" : ""}`}>
            <div className="accordion-title" onClick={() => toggleAccordion("about")}>
              About Us <FaChevronDown className="arrow" />
            </div>
            <div className="accordion-content">
              <p>
                Skill Nexus connects skilled professionals with organizations
                through intelligent job matching and career guidance.
              </p>
            </div>
          </li>

          <li className={`nav-accordion ${openItem === "company" ? "open" : ""}`}>
            <div className="accordion-title" onClick={() => toggleAccordion("company")}>
              Company Info <FaChevronDown className="arrow" />
            </div>
            <div className="accordion-content">
              <p>
                We serve healthcare, IT, banking, and telecom industries with
                scalable recruitment solutions.
              </p>
            </div>
          </li>

          <li className={`nav-accordion ${openItem === "contact" ? "open" : ""}`}>
            <div className="accordion-title" onClick={() => toggleAccordion("contact")}>
              Contact <FaChevronDown className="arrow" />
            </div>
            <div className="accordion-content">
              <p>
                Contact our support team for job assistance, recruiter onboarding,
                or technical support.
              </p>
            </div>
          </li>

          <li className={`nav-accordion ${openItem === "team" ? "open" : ""}`}>
            <div className="accordion-title" onClick={() => toggleAccordion("team")}>
              Our Team <FaChevronDown className="arrow" />
            </div>
            <div className="accordion-content">
              <p>
                Our team includes developers, recruiters, and mentors committed
                to building meaningful hiring experiences.
              </p>
            </div>
          </li>

          {/* THEME TOGGLE */}
          <li className="theme-toggle" onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }>
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </li>

        </ul>
      </nav>
    </>
  );
}

export default Navbar;
