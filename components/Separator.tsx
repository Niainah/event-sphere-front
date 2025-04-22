import React from 'react';

export default function Separator() {
  return (
    <>
      <div className="separator-container">
        <div className="separator-wrapper">
          <div className="separator-line" />
          
          <div className="diamond-container">
            <div className="diamond-outer" />
            <div className="diamond-inner" />
          </div>

          <div className="dots-container">
            <div className="dot dot-left" />
            <div className="dot dot-right" />
          </div>
        </div>
      </div>

      <style>{`
        .separator-container {
          width: 100%;
          padding: 2rem 0;
        }

        .separator-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .separator-line {
          width: 100%;
          height: 2px;
          background: linear-gradient(
            to right,
            transparent 0%,
            #1a3c34 50%,
            transparent 100%
          );
          opacity: 0.5;
        }

        .diamond-container {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .diamond-outer {
          width: 16px;
          height: 16px;
          background-color: #1a3c34;
          transform: rotate(45deg);
          animation: pulseSlow 2s infinite;
        }

        .diamond-inner {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: white;
          transform: rotate(45deg);
          animation: pulseSlow 2s infinite;
        }

        @media (prefers-color-scheme: dark) {
          .diamond-inner {
            background-color: #111827;
          }
        }

        .dots-container {
          position: absolute;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 1rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          background-color: #1a3c34;
          border-radius: 50%;
          animation: bounce 1s infinite;
        }

        .dot-left {
          animation-delay: 0s;
        }

        .dot-right {
          animation-delay: 0.2s;
        }

        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
}