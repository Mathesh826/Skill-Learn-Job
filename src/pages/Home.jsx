import { useEffect } from "react";
import Swal from "sweetalert2";

import AutoShowcase from "../components/AutoShowcase";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import OurServices from "../components/OurServices";
import SideBar from "../components/SideBar";
import WhyChooseUs from "../components/WhyChooseUs";

function Home() {

  useEffect(() => {
  const logoutFlag = localStorage.getItem("logout_success");

  if (logoutFlag) {
    // 🔊 Logout sound
    const logoutSound = new Audio("/sounds/out.mp3");
    logoutSound.volume = 0.15;
    logoutSound.play().catch(() => {}); // prevent autoplay error

    Swal.fire({
      icon: "success",
      title: "Logout Successful",
      text: "You have been logged out safely.",
      toast: true,
      position: "center",
      timer: 2500,
      showConfirmButton: false,
      background: "transparent",
      color: "white",
      customClass: {
        popup: "toast-glass"
      }
    });

    localStorage.removeItem("logout_success");
  }
}, []);


  return (
    <>
      <Navbar />
      <SideBar />
      <AutoShowcase />
      <WhyChooseUs />
      <OurServices />
      <Footer />
    </>
  );
}

export default Home;
