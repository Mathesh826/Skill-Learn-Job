import React from "react";
import styled from "styled-components";

const Loader = ({ message = "Loading..." }) => {
  return (
    <StyledWrapper>
      <div className="overlay">
        <div className="spinner-box">
          <div className="configure-border-1">
            <div className="configure-core" />
          </div>

          <div className="configure-border-2">
            <div className="configure-core" />
          </div>
        </div>

        <p className="loader-text">{message}</p>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* =============================
     FULL SCREEN BLACK BLUR
  ============================= */
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);



  /* =============================
     CENTER CONTAINER
  ============================= */
  .overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }



  /* =============================
     SPINNER BOX (IMPORTANT FIX)
  ============================= */
  .spinner-box {
    width: 60px;
    height: 60px;
    position: relative; /* ⭐ key fix */
  }



  /* =============================
     BORDERS
  ============================= */
  .configure-border-1,
  .configure-border-2 {
    position: absolute;
    inset: 0;

    padding: 4px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 10px;
  }

  .configure-border-1 {
    background: #fb5b53;
    animation: configure-clockwise 3s ease-in-out infinite;
  }

  .configure-border-2 {
    background: rgb(63, 249, 220);
    transform: rotate(45deg);
    animation: configure-xclockwise 3s ease-in-out infinite;
  }

  .configure-core {
    width: 100%;
    height: 100%;
    background-color: #1d2630;
    border-radius: 6px;
  }



  /* =============================
     TEXT
  ============================= */
  .loader-text {
    margin-top: 20px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
  }



  /* =============================
     ANIMATIONS
  ============================= */
  @keyframes configure-clockwise {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes configure-xclockwise {
    100% {
      transform: rotate(-315deg);
    }
  }
`;

export default Loader;
