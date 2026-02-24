import { useEffect } from "react";

import RecruiterNavbarAccordion from "../Recruiter_component/RecruiterNavbarAccordion";
import RecruiterSidebar from "../Recruiter_component/RecruiterSidebar";
import IndustryBanner from "../Recruiter_component/IndustryBanner";
import RecruiterCards from "../Recruiter_component/RecruiterCards";
import RecruiterFooter from "../Recruiter_component/RecruiterFooter";
import RecruiterAnalytics from "../Recruiter_component/RecruiterAnalytics";


const RecruiterPage = () => {
  useEffect(() => {
    const recruiter = localStorage.getItem("recruiter");
    if (!recruiter) {
      window.location.href = "/";
    }
  }, []);

  return (
    <>
    <RecruiterNavbarAccordion/>
    <RecruiterSidebar/>
    <IndustryBanner/>
    <RecruiterCards/>
    <RecruiterAnalytics/>
    <RecruiterFooter/>
   
    </>
  );
};

export default RecruiterPage;
