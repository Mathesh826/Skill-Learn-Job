import { motion } from "framer-motion";
import "../styles/user.css";

import google from "../assets/logos/google.png";
import amazon from "../assets/logos/amazon.png";
import microsoft from "../assets/logos/microsoft.png";
import infosys from "../assets/logos/infosys.png";
import tcs from "../assets/logos/tcs.png";
import wipro from "../assets/logos/wipro.png";

const companies = [
  { name: "Google", logo: google },
  { name: "Amazon", logo: amazon },
  { name: "Microsoft", logo: microsoft },
  { name: "Infosys", logo: infosys },
  { name: "TCS", logo: tcs },
  { name: "Wipro", logo: wipro }
];

const TopHiringCompanies = () => {
  return (
    <section className="hiring-wrapper">
      <h2 className="learning-title">Top Hiring Companies</h2>

      <div className="hiring-marquee">
        <motion.div
          className="hiring-track"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 22,   // ⏩ speed (lower = faster)
            ease: "linear"
          }}
        >
          {[...companies, ...companies].map((company, index) => (
            <div className="hiring-card" key={index}>
              <img
                src={company.logo}
                alt={company.name}
                className="company-logo"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TopHiringCompanies;
