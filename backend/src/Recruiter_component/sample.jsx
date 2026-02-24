import React from "react";
import styled from "styled-components";

const Loader = ({ message = "Redirecting..." }) => {
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
     GLASS OVERLAY INSIDE CARD ONLY
  =============================== */
  .panel-loader {
    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 18px;

    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(6px);

    animation: fadeIn .3s ease;
    z-index: 50;
  }

  @keyframes fadeIn {
    from { opacity: 0 }
    to { opacity: 1 }
  }


  /* ===============================
     PROFESSIONAL SPINNER (UIVERSE)
  =============================== */
  .custom-loader {
    width: 56px;
    height: 56px;
    display: grid;
    animation: pop .25s ease;
  }

  @keyframes pop {
    from { transform: scale(.8); opacity: 0 }
    to { transform: scale(1); opacity: 1 }
  }

  .custom-loader::before,
  .custom-loader::after {
    content: "";
    grid-area: 1/1;

    --c: radial-gradient(
      farthest-side,
      #203a43 92%,
      rgba(0,0,0,0)
    );

    background:
      var(--c) 50% 0,
      var(--c) 50% 100%,
      var(--c) 100% 50%,
      var(--c) 0 50%;

    background-size: 12px 12px;
    background-repeat: no-repeat;

    animation: spin 1s infinite;
  }

  .custom-loader::before {
    margin: 6px;
    filter: hue-rotate(40deg);
    background-size: 8px 8px;
    animation-timing-function: linear;
  }

  @keyframes spin {
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
    font-weight: 600;
    color: #203a43;
    letter-spacing: .5px;
  }
`;

export default Loader;
