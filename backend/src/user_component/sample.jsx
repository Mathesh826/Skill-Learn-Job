const ProfileWelcomeCard = () => {
  
  return (
    <div className="page-layout">

      {/* SIDEBAR */}
      <aside className="sidebar"></aside>

      {/* WELCOME AREA */}
      <section className="welcome-half-bg">

        <div className="welcome-left">
          <h1>
            Welcome <br />
            <span>{user.name}</span>
          </h1>
          <p>Your journey starts here 🚀</p>
        </div>

        <div className="welcome-right">
          <div
            className="flip-wrapper"
            onClick={() => setFlipped(p => !p)}
          >
            <div className={`flip-card ${flipped ? "flipped" : ""}`}>

              <div className="flip-front glow-border">
                <img
                  src={user.image || "/default-profile.png"}
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
