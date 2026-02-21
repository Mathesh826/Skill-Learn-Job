import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram
} from "react-icons/fa";

import "../styles/user.css";

const UserFooter = () => {
  return (
    <footer className="user-footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <h2>YourCompany</h2>
          <p>Empowering careers with top tech opportunities.</p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Courses</a></li>
            <li><a href="#">Jobs</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: support@skillmatch.com</p>
          <p>Phone: +91 98765 43210</p>
          <div className="footer-socials">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>

      </div>

      {/* FOOTER BOTTOM */}
      <div className="footer-bottom">
        <p className="footer-left">© {new Date().getFullYear()} Skill_Match. All rights reserved.</p>
        <p className="footer-right">Developed by Mathesh M, Software Developer</p>
      </div>
    </footer>
  );
};

export default UserFooter;
