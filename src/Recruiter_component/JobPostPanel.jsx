import { useState } from "react";
import "../styles/Recruiterpage.css";
import Loader from "../Recruiter_component/LoderModule_1";
import Swal from "sweetalert2";




export default function JobPostPanel({ open, onClose, recruiter }) {
  
  const [logoPreview, setLogoPreview] = useState(null);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    onClose(); // ✅ close modal immediately
    setLoading(true); // ✅ show fullscreen loader

    const formData = new FormData(e.target);

    const res = await fetch("http://localhost:5000/post-job", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setTimeout(() => {
  setLoading(false);

  // ✅ RESET FORM (VERY IMPORTANT)
  e.target.reset();          // clear all inputs
  setLogoPreview(null);      // clear image preview
  setAgree(false);           // uncheck checkbox

  const Toast = Swal.mixin({
    toast: true,
    position: "top-center",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: "rgba(20,20,20,0.85)",
    color: "#fff",
    customClass: {
      popup: "mini-toast",
    },
    showClass: {
      popup: "animate__animated animate__fadeInRight"
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutRight"
    }
  });

  if (data.status === "success") {
    new Audio("/sounds/ding.mp3").play();

    Toast.fire({
      icon: "success",
      title: "Job Posted Successfully"
    });

  } else {
    new Audio("/sounds/error1.mp3").play();

    Toast.fire({
      icon: "error",
      title: "Something went wrong"
    });
  }

}, 15000);


  };

  return (
    <>
      <div className={`job-modal ${open ? "show" : ""}`}>
        <div className="job-modal-overlay" onClick={onClose}></div>

        <div className="job-modal-card">
          <h2>Post a New Job</h2>

          <form className="job-modal-form" onSubmit={handleSubmit}>
            {/* LEFT */}
            <div className="left-upload">
              <label>Company Logo</label>

              <div className="upload-box">
                {logoPreview ? (
                  <img src={logoPreview} alt="preview" />
                ) : (
                  <span>Drop or Choose Logo</span>
                )}
              </div>

              <input
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>

            {/* RIGHT */}
            <div className="right-fields">
              <input
                name="company"
                type="text"
                value={recruiter?.company || ""}
                readOnly
              />

              <input name="role" type="text" placeholder="Choose or type Role" list="roles" />

              <datalist id="roles">
                <option value="Frontend Developer" />
                <option value="Backend Developer" />
                <option value="Full Stack Developer" />
                <option value="HR Manager" />
              </datalist>

              <input name="location" type="text" placeholder="Location" />
              <input name="salary" type="text" placeholder="Salary (₹ / year)" />
              <textarea name="description" placeholder="Job Description" className="full-width" />

              <label className="agree-box full-width">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                />
                I agree to terms
              </label>

              <button
                type="submit"
                disabled={!agree}
                className="submit-btn full-width"
              >
                Submit Job
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ Fullscreen Loader */}
      {loading && <Loader />}
    </>
  );
}
