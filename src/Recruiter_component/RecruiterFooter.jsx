import "../styles/Recruiterpage.css";
import {
  FaBriefcase,
  FaUsers,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaHeart
} from "react-icons/fa";

export default function RecruiterFooter() {
  return (
    <footer className="recruiter-footer">
      <div className="footer-container">

        {/* About */}
        <div className="footer-col">
          <h3>Job Portal</h3>
          <p>
            Post jobs, track applicants, and hire top talents easily with our
            smart recruitment system.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><FaBriefcase /> Post Job</li>
            <li><FaUsers /> Manage Applicants</li>
            <li><FaEnvelope /> Messages</li>
          </ul>
        </div>

        {/* Social */}
        <div className="footer-col">
          <h4>Follow Us</h4>

          <div className="socials">
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaGithub /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="mailto:someone@email.com"><FaEnvelope /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      {/* Bottom */}
<div className="footer-bottom">
  <div className="footer-copy">
    © {new Date().getFullYear()} Recruiter Portal | All Rights Reserved
  </div>

  <div className="footer-dev">
    Developed with <FaHeart className="heart" /> by{" "}
    <span className="developer">Mathesh M</span> — Software Developer
  </div>
</div>

    </footer>
  );
}
