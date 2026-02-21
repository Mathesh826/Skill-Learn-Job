import React from "react";
import styled from "styled-components";

const Loader = () => {
    return (
        <StyledWrapper>
            <div className="glass-card">
                <div className="loader-con">
                    <div className="pfile" style={{ "--i": 0 }} />
                    <div className="pfile" style={{ "--i": 1 }} />
                    <div className="pfile" style={{ "--i": 2 }} />
                    <div className="pfile" style={{ "--i": 3 }} />
                    <div className="pfile" style={{ "--i": 4 }} />
                    <div className="pfile" style={{ "--i": 5 }} />
                </div>

                <p className="loading-text">Requirement Posting...</p>
            </div>
        </StyledWrapper>
    );
};

export default Loader;


/* ================================
   STYLES
================================ */

const StyledWrapper = styled.div`
  /* FULL SCREEN BLUR OVERLAY */
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);   /* darker black */
  backdrop-filter: blur(14px);      /* stronger blur */
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  /* GLASS CARD */
  .glass-card {
    width: 340px;
    height: 220px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;



    padding: 20px;
  }

  /* FILE CONTAINER */
  .loader-con {
    position: relative;
    width: 100%;
    height: 110px;
    overflow: hidden;
  }

  /* FLYING FILES */
  .pfile {
    position: absolute;
    bottom: 25px;
    width: 70px;
    height: 80px;

    background: linear-gradient(90deg, #b324db, #4884f3);
    border-radius: 6px;

    transform-origin: center;
    animation: flyRight 3s ease-in-out infinite;
    opacity: 0;

    animation-delay: calc(var(--i) * 0.6s);
  }

  .pfile::before,
  .pfile::after {
    content: "";
    position: absolute;
    left: 6px;
    background-color: #fff;
    border-radius: 2px;
  }

  .pfile::before {
    top: 6px;
    width: 28px;
    height: 4px;
  }

  .pfile::after {
    top: 14px;
    width: 18px;
    height: 4px;
  }

  @keyframes flyRight {
    0% {
      left: -10%;
      transform: scale(0);
      opacity: 0;
    }
    50% {
      left: 45%;
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      left: 110%;
      transform: scale(0);
      opacity: 0;
    }
  }

  /* BOTTOM TEXT */
  .loading-text {
    margin-top: 18px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: #ffffff;
    opacity: 0.9;
  }
`;
