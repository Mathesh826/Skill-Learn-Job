import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { FaUserTie, FaUsers, FaCheckCircle } from "react-icons/fa";

const WhyChooseUs = () => {
  const showcaseRef = useRef(null);
  const sectionRef = useRef(null);

  const [startCount, setStartCount] = useState(false);
  const [showSection, setShowSection] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          setShowSection(true);   // ⭐ trigger animation once
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-scroll-wrapper" ref={sectionRef}>
      <div className="why-scroll-container">

        <h2 className="why-title">Why Choose Us?</h2>

        <div className="why-cards">
          <div className={`why-card ${showSection ? "show" : ""}`}>
            <h4>Smart Job Matching</h4>
            <p>
              Our system matches candidates with jobs based on skills,
              experience, and domain relevance.
            </p>
          </div>

          <div className={`why-card ${showSection ? "show" : ""}`}>
            <h4>Recruiter-Friendly Platform</h4>
            <p>
              Recruiters can easily filter, shortlist, and connect with the
              right talent.
            </p>
          </div>

          <div className={`why-card ${showSection ? "show" : ""}`}>
            <h4>Career Growth Focus</h4>
            <p>
              We help users build meaningful careers with continuous
              opportunities.
            </p>
          </div>
        </div>

        <div
          className={`auto-showcase ${showSection ? "show" : ""}`}
          ref={showcaseRef}
        >
          <div className="showcase-item">
            <FaUserTie size={36} color="#0a58ca" />
            <h3>{startCount ? <CountUp end={500} duration={2} /> : 0}+</h3>
            <span>Recruiters</span>
          </div>

          <div className="showcase-item">
            <FaUsers size={36} color="#0a58ca" />
            <h3>{startCount ? <CountUp end={10000} duration={2} /> : 0}+</h3>
            <span>Job Seekers</span>
          </div>

          <div className="showcase-item">
            <FaCheckCircle size={36} color="#0a58ca" />
            <h3>{startCount ? <CountUp end={95} duration={2} /> : 0}%</h3>
            <span>Placement Success</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;