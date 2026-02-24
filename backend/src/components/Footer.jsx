
const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-section">
          <h3>SkillMatch</h3>
          <p>
            Connecting talent with opportunity through smart recruitment
            solutions.
          </p>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li>Healthcare Recruitment</li>
            <li>IT & Software Jobs</li>
            <li>Banking & Finance</li>
            <li>Networking & Telecom</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Jobs</li>
            <li>Recruiters</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@skillmatch.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>

      </div>

      <div className="footer-bottom">
       <p> © {new Date().getFullYear()} SkillMatch. All Rights Reserved.</p>
       <p className="footer-right">Developed by Mathesh M, Software Developer</p>
      </div>
    </footer>
  );
};

export default Footer;
