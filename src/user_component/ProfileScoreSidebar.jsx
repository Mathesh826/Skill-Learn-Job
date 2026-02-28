import { useEffect, useState } from "react";
import "../styles/user.css";

const ProfileScoreSidebar = () => {
  const [score, setScore] = useState(0);

  const calculateScore = (data) => {
    let s = 0;

    if (data.father_name) s += 10;
    if (data.gender) s += 10;
    if (data.dob) s += 10;

    if (Array.isArray(data.education))
      s += Math.min(data.education.length * 10, 20);

    if (Array.isArray(data.skills))
      s += Math.min(data.skills.length * 5, 20);

    if (Array.isArray(data.role))
      s += Math.min(data.role.length * 10, 20);

    if (data.image_path) s += 10;

    if (Array.isArray(data.certificates))
      s += Math.min(data.certificates.length * 5, 10);

    return Math.min(s, 100);
  };

  const getLevel = () => {
    if (score < 40) return { label: "Low", class: "low" };
    if (score < 70) return { label: "Medium", class: "medium" };
    return { label: "High", class: "high" };
  };

  const fetchAndUpdate = async () => {
  const userId = localStorage.getItem("user_id");
  if (!userId) return;

  try {
    const res = await fetch(
      `https://skill-learn-job.onrender.com/get-profile/${userId}`
    );

    const data = await res.json();

    if (res.ok) {
      setScore(calculateScore(data)); // ✅ now gets full profile
    }

  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
  const sidebar = document.querySelector(".profile-score-sidebar");
  if (sidebar) {
    requestAnimationFrame(() => {
      sidebar.classList.add("show");
    });
  }
}, []);

  useEffect(() => {
    fetchAndUpdate();

    const handler = () => fetchAndUpdate();
    window.addEventListener("profile-updated", handler);

    return () => window.removeEventListener("profile-updated", handler);
  }, []);

  const level = getLevel();

  return (
    <aside className="profile-score-sidebar">
      <h4 className="score-title">Your Profile Score</h4>

      <div className={`score-ring ${level.class}`}>
        <span className="score-value">{score}%</span>
      </div>

      <div className={`score-status ${level.class}`}>
        {level.label} Profile
      </div>

      <p className="score-hint">
        Complete your profile to increase score
      </p>
    </aside>
  );
};

export default ProfileScoreSidebar;
