import { useEffect, useRef, useState } from "react";
import {
  FaBriefcase,
  FaUsers,
  FaClipboardList,
  FaChartLine,
} from "react-icons/fa";
import "../styles/Recruiterpage.css";

export default function RecruiterCards() {
  const gridRef = useRef(null);
  const [show, setShow] = useState(false);

  // ✅ Trigger animation only when section scrolls into view (once)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (entries[0].isIntersecting) {
          setShow(true);     // add animation class
          obs.disconnect();  // run only once
        }
      },
      {
        threshold: 0.4, // trigger when 40% visible
      }
    );

    observer.observe(gridRef.current);

    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      icon: <FaBriefcase />,
      title: "Post Jobs",
      desc: "Create and publish job openings to attract the right candidates quickly and efficiently.",
    },
    {
      icon: <FaUsers />,
      title: "Manage Applicants",
      desc: "View applications, shortlist candidates, and schedule interviews from one place.",
    },
    {
      icon: <FaClipboardList />,
      title: "Track Listings",
      desc: "Monitor active and expired job posts and update requirements anytime.",
    },
    {
      icon: <FaChartLine />,
      title: "Hiring Insights",
      desc: "Analyze recruiter performance and hiring metrics with real-time statistics.",
    },
  ];

  return (
    <div className="recruiter-section">
      <h2 className="section-title">Recruiter Dashboard</h2>

      {/* animation class added when scrolled */}
      <div
        ref={gridRef}
        className={`cards-grid ${show ? "show-cards" : ""}`}
      >
        {cards.map((card, index) => (
          <div className="recruiter-card" key={index}>
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
