import { useEffect, useState } from "react";
import "../styles/user.css";
import defaultProfile from "../assets/bg5.png";



const ProfileWelcomeCard = () => {
  const [user, setUser] = useState({
    name: "",
    image: null
  });

  const [flipped, setFlipped] = useState(false);

  const fetchUser = async () => {
  const userId = localStorage.getItem("user_id"); // ✅ match login key
  if (!userId) return;

  try {
    // ✅ call both APIs
    const userRes = await fetch(
      `https://skill-learn-job.onrender.com/get-user/${userId}`
    );
    const userData = await userRes.json();

    const profileRes = await fetch(
      `https://skill-learn-job.onrender.com/get-profile/${userId}`
    );
    const profileData = await profileRes.json();

    setUser({
      name: userData.name || "",
      image: profileData.image_path || null
    });

  } catch (err) {
    console.error(err);
  }
};

  /* AUTO FLIP */
  useEffect(() => {
    const interval = setInterval(() => {
      setFlipped(prev => !prev);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  /* FETCH */
  useEffect(() => {
    fetchUser();
    const handler = () => fetchUser();
    window.addEventListener("profile-updated", handler);
    return () => window.removeEventListener("profile-updated", handler);
  }, []);

  return (
    <div className="page-layout">

      {/* SIDEBAR */}
      <aside className="sidebar"></aside>

      {/* WELCOME AREA */}
      <section className="welcome-half-bg">

        <div className="welcome-left">
          <h1 className="welcome-title">
            <span className="welcome-word">WELCOME</span><br />
            <span className="welcome-name">{user.name}</span>
          </h1>
          <p>Your journey starts here.</p>
        </div>

        <div className="welcome-right">
          <div
            className="flip-wrapper"
            onClick={() => setFlipped(p => !p)}
          >
            <div className={`flip-card ${flipped ? "flipped" : ""}`}>

              <div className="flip-front glow-border">
                <img
                  src={user.image ? user.image : defaultProfile}
                  alt="Profile"
                />
              </div>

              <div className="flip-back glow-border">
                <span>
                  HAPPY JOURNEY<br />
                  {user.name}
                </span>
              </div>

            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default ProfileWelcomeCard;
