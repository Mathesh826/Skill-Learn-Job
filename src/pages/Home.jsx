import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import AutoShowcase from "../components/AutoShowcase";
import Footer from "../components/Footer";
import OurServices from "../components/OurServices";
import WhyChooseUs from "../components/WhyChooseUs";
import Navbar from "../components/Nav";
import Sidebar from "../components/Module_sidebar";
import LoginPanel from "../components/LoginPanel";

function Home() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [startRegister, setStartRegister] = useState(false);

  const openRegisterPanel = () => {
    setStartRegister(true);
    setIsPanelOpen(true);
  };

  useEffect(() => {
    const logoutFlag = localStorage.getItem("logout_success");

    if (logoutFlag) {
      const logoutSound = new Audio("/sounds/out.mp3");
      logoutSound.volume = 0.15;
      logoutSound.play().catch(() => {});

      Swal.fire({
      icon: "success",
      title: "Logout Successful",
      text: "You have been logged out safely.",
      toast: true,
      position: "center",
      timer: 2500,
      showConfirmButton: false,
      background: "white",
      color: "black",
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
      <Sidebar />

      <AutoShowcase onRegisterClick={openRegisterPanel} />

      <WhyChooseUs />
      <OurServices />
      <Footer />

      <LoginPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        startRegister={startRegister}
      />
    </>
  );
}

export default Home;