import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/user.css";

export default function JobPage({ onClose }) {

  const [touchStartX, setTouchStartX] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resume, setResume] = useState(null);

  // NEW → slide animation class
  const [slideClass, setSlideClass] = useState("");

  const userId = localStorage.getItem("user_id");


  /* ================= fetch jobs ================= */
  useEffect(() => {
    axios
      .get(`https://skill-learn-job.onrender.com/get-matching-jobs/${userId}`)
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setJobs(sorted);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  const job = jobs[currentIndex];


  /* ================= navigation ================= */

  const nextJob = () => {
    if (currentIndex < jobs.length - 1) {
      setSlideClass("slide-left");
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevJob = () => {
    if (currentIndex > 0) {
      setSlideClass("slide-right");
      setCurrentIndex(currentIndex - 1);
    }
  };


  /* ================= apply ================= */

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleApply = async () => {
    if (!resume) return alert("Upload resume first");

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_id", job.id);
    formData.append("user_id", userId);

    await axios.post("https://skill-learn-job.onrender.com/apply-job", formData);
    alert("Applied Successfully!");
  };


  /* ================= swipe ================= */

  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].screenX);
  };

  const handleTouchEnd = (e) => {
    const distance = e.changedTouches[0].screenX - touchStartX;

    if (distance < -70) nextJob();
    if (distance > 70) prevJob();
  };


  return (
    <div className="job-page">

      {/* ===== OUTSIDE HEADER (border only) ===== */}
      <div className="job-header">
        <h5>Your Interested Jobs</h5>
      </div>

      {/* ===== NEW: inside top bar ===== */}
            <div className="job-card-top">
              <span className="job-time">
                {new Date().toLocaleString()}
              </span>

              <button className="job-close-btn" onClick={onClose}>
                ✕
              </button>
            </div>


      {!job ? (
        <p><center>No jobs available</center></p>
      ) : (
        <>
          {/* ===== MAIN CARD ===== */}
          <div
            key={currentIndex}
            className={`job-main-card swipe-card ${slideClass}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >

            


            {/* ===== OLD CONTENT (unchanged) ===== */}
            <div className="job-left">
              <img
                src={`https://skill-learn-job.onrender.com/uploads/${job.logo}`}
                alt=""
              />

              <h3>{job.company_name}</h3>
              <p>Role : {job.role}</p>
              <p>Location : {job.location}</p>
              <p>Salary : ₹{job.salary}</p>
            </div>

            <div className="job-right">
              <p className="job-desc">
                <h5>About</h5>
                {job.description}
              </p>

              <div className="job-actions">
                <input type="file" onChange={handleResumeChange} />
                <button onClick={handleApply}>Apply</button>
              </div>
            </div>
          </div>


          {/* ===== BOTTOM NAV (same) ===== */}
          <div className="job-bottom-nav">
            <button onClick={prevJob} disabled={currentIndex === 0}>
              Previous
            </button>

            <button
              onClick={nextJob}
              disabled={currentIndex === jobs.length - 1}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
