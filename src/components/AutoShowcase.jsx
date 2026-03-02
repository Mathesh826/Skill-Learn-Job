import { useEffect, useState } from "react";

const slides = [
  "Connecting Skills\nwith Real-World\nOpportunities",

  "Smart Hiring\nStarts with\nSkill Intelligence",

  "Where Talent\nMeets the\nRight Industry"
];

export default function AutoShowcase({ onRegisterClick }) {
  const [index, setIndex] = useState(0);

  /* change every 30 seconds */
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const lines = slides[index].split("\n");

  return (
    <section className="split-hero">

      <div className="hero-content">
        <h1 key={index} className="hero-text">
          {lines.map((line, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.5}s` }}>
              {line}
            </span>
          ))}
        </h1>

        <button className="register-btn--2" onClick={onRegisterClick}>
  User Register
</button>
      </div>

    </section>
  );
}