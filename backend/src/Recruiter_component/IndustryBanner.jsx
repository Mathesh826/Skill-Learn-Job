import "../styles/Recruiterpage.css";
import { useEffect, useState } from "react";
import JobPostPanel from "../Recruiter_component/JobPostPanel";

export default function IndustryBanner() {
  const [show, setShow] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);

  // example recruiter data (later you can get from login/session)
  const recruiter = {
    company: "TCS",
    logo: "/logos/tcs.png",
  };

  useEffect(() => {
    setTimeout(() => setShow(true), 200);
  }, []);

  return (
    <div className="industry-banner">

      {/* ===== LOGOS ===== */}
      <div className={`company-logos ${show ? "logos-show" : ""}`}>
        <div className="diamond"><img src="/logos/tcs.png" alt="tcs" /></div>
        <div className="diamond"><img src="/logos/google.png" alt="google" /></div>
        <div className="diamond"><img src="/logos/infosys.png" alt="infosys" /></div>
      </div>

      {/* ===== TEXT ===== */}
      <div className={`content ${show ? "content-show" : ""}`}>
        <h1>
          Achievers of the Industry <br />
          & Industrial Revolutionaries
        </h1>

        <div className="banner-buttons">
          <button
            className="post-btn"
            onClick={() => setOpenPanel(true)}
          >
            Job Post
          </button>

          <button className="explore-btn">Explore</button>
        </div>
      </div>

      {/* ✅ NEW COMPONENT */}
      <JobPostPanel
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        recruiter={recruiter}
      />
    </div>
  );
}
