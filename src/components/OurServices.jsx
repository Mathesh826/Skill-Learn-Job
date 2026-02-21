import healthcareImg from "../assets/bg1.jpg";
import itImg from "../assets/bg2.jpg";
import bankingImg from "../assets/bg3.jpg";
import networkImg from "../assets/bg4.jpg";


// Sample service images (replace with your own images or URLs)
const servicesList = [
  {
    title: "Healthcare",
    description: "Connecting skilled professionals with top hospitals.",
    img: healthcareImg,
  },
  {
    title: "IT & Software",
    description: "Delivering top IT talent for tech projects.",
    img: itImg,
  },
  {
    title: "Banking & Finance",
    description: "Providing experts for banks and finance sectors.",
    img: bankingImg,
  },
  {
    title: "Networking & Telecom",
    description: "Recruiting professionals for telecom networks.",
    img: networkImg,
  },
];

const OurServices = () => {
  return (
    <section className="services-wrapper">
      <div className="services-container">
        <h2 className="services-title">Our Services</h2>

        {/* Service Cards */}
        <div className="services-cards">
          {servicesList.map((service, index) => (
            <div className="service-card" key={index}>
              <img src={service.img} alt={service.title} className="service-img" />
              <h4>{service.title}</h4>
              <p>{service.description}</p>
            </div>
          ))}
        </div>

        

      </div>
    </section>
  );
};

export default OurServices;
