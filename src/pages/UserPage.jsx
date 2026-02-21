import { useState } from "react";
import UserNavbar from "../user_component/UserNavbar";
import ProfilePanel from "../user_component/ProfilePanel";
import ProfileScoreSidebar from "../user_component/ProfileScoreSidebar";
import ProfileWelcomeCard from "../user_component/ProfileWelcomeCard";
import LearningJourney from "../user_component/LearningJourney";
import TopHiringCompanies from "../user_component/TopHiringCompanies";
import JobPage from "../user_component/JobPage";
import UserFooter from "../user_component/UserFooter";
import "../styles/user.css";

function UserPage() {
  const [showProfilePanel, setShowProfilePanel] = useState(false);

  // page switch
  const [activeSection, setActiveSection] = useState("home");

  const userId = localStorage.getItem("user_id");

  return (
    <>
      {/* ⭐ HIDE NAVBAR WHEN JOB PAGE OPEN */}
      {activeSection !== "jobs" && (
        <UserNavbar
          setShowProfilePanel={setShowProfilePanel}
          setActiveSection={setActiveSection}
        />
      )}

      <ProfileScoreSidebar />

      <div className="section-wrapper">

        {activeSection === "home" && (
          <div className="section-animate fade-in">
            <ProfileWelcomeCard />
          </div>
        )}

        {activeSection === "jobs" && (
          <div className="section-animate slide-in">
            <JobPage onClose={() => setActiveSection("home")} />
          </div>
        )}

      </div>

      <LearningJourney />
      <TopHiringCompanies />
      <UserFooter />

      {showProfilePanel && (
        <ProfilePanel
          userId={userId}
          onClose={() => setShowProfilePanel(false)}
        />
      )}
    </>
  );
}

export default UserPage;
