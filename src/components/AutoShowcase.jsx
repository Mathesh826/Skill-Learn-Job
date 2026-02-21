import { useEffect, useState } from "react";
import img1 from "../assets/bg04.jpg";
import img2 from "../assets/bg02.jpg";
import img3 from "../assets/bg03.jpg";




const slides = [
  {
    image: img1,
    text: "Connecting Skills with Real-World Opportunities"
  },
  {
    image: img2,
    text: "Smart Hiring Starts with Skill Intelligence"
  },
  {
    image: img3,
    text: "Where Talent Meets the Right Industry"
  }
];

export default function SplitAutoHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="split-hero">
      {/* LEFT IMAGE */}
      <div
        key={index}
        className="hero-image"
        style={{ backgroundImage: `url(${slides[index].image})` }}
      >
        <div className="image-overlay" />
      </div>

      {/* RIGHT CONTENT */}
      <div className="hero-content">
        <h1 key={index} className="typing-glow">
          {slides[index].text}
        </h1>

        <div className="hero-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
