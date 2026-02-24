import {
  FaUnlockAlt,
  FaBookOpen,
  FaClipboardCheck,
  FaCertificate
} from "react-icons/fa";

import { motion } from "framer-motion";
import "../styles/user.css";

const cardVariants = {
  hidden: {
    opacity: 0,
    x: -80,
    scale: 0.9
  },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: index * 0.15,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

const LearningSteps = () => {
  return (
    <section className="learning-wrapper">
      <h2 className="learning-title">Your Learning Steps</h2>

      <div className="learning-grid">

        {[
          {
            icon: <FaUnlockAlt />,
            title: "Unlock Courses",
            desc: "Unlock all available courses and begin your learning journey.",
            gradient: "gradient-one"
          },
          {
            icon: <FaBookOpen />,
            title: "Learn Daily",
            desc: "Build skills day by day with structured learning paths.",
            gradient: "gradient-two"
          },
          {
            icon: <FaClipboardCheck />,
            title: "Complete Assessment",
            desc: "Test your knowledge with practical assessments.",
            gradient: "gradient-two"
          },
          {
            icon: <FaCertificate />,
            title: "Download Certificate",
            desc: "Get your certificate after successful course completion.",
            gradient: "gradient-one"
          }
        ].map((step, index) => (
          <motion.div
            key={step.title}
            className={`learning-card ${step.gradient}`}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}   // 🔁 animate again on scroll
            custom={index}
          >
            <div className="step-icon">{step.icon}</div>
            <div className="step-text">
              <h1>{step.title}</h1>
              <p>{step.desc}</p>
            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
};

export default LearningSteps;
