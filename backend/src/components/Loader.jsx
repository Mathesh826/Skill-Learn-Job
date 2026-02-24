import React from "react";
import styled from "styled-components";

const Loader = ({ message = "Logging you in…" }) => {
  return (
    <StyledWrapper>
      <div className="panel-loader">
        <div className="custom-loader" />
        <p className="loader-text">{message}</p>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`

  /* ===============================
     PANEL OVERLAY (same concept)
  =============================== */
  .panel-loader {
    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(3px);

    z-index: 20;

    animation: fadeIn 0.25s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }


  /* ===============================
     UIVERSE CUSTOM LOADER
  =============================== */
  .custom-loader {
    width: 50px;
    height: 50px;
    display: grid;
  }

  .custom-loader::before,
  .custom-loader::after {
    content: "";
    grid-area: 1/1;

    --c: radial-gradient(
      farthest-side,
      #1692f8 92%,
      rgba(179, 53, 53, 0)
    );

    background:
      var(--c) 50% 0,
      var(--c) 50% 100%,
      var(--c) 100% 50%,
      var(--c) 0 50%;

    background-size: 12px 12px;
    background-repeat: no-repeat;

    animation: s2 1s infinite;
  }

  .custom-loader::before {
    margin: 4px;
    filter: hue-rotate(45deg);
    background-size: 8px 8px;
    animation-timing-function: linear;
  }

  @keyframes s2 {
    100% {
      transform: rotate(.5turn);
    }
  }


  /* ===============================
     TEXT
  =============================== */
  .loader-text {
    margin-top: 16px;
    font-size: 14px;
    letter-spacing: 0.5px;
    color: white;
    opacity: 0.9;
  }
`;

export default Loader;
