// components/Header.js
import React from "react";

export default function Header({ userName = "there", onPlan = () => {} }) {
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="hero-left">
            <p className="greet">Hey, <strong>{userName}</strong></p>
            <h1 className="title">Where are we going next?</h1>
            <p className="subtitle">
              Panchi finds the smartest, safest and cheapest ways to reach your
              destination — starting with flights in this MVP, and later adding
              trains, buses and cabs.
            </p>

            <div className="search-row">
              <input
                aria-label="Where to?"
                className="search-input"
                placeholder={`Try "Goa", "Manali", "Jaipur" or "beach under 5k"`}
                id="panchi-search"
              />
              <button
                className="cta"
                onClick={(e) => {
                  e.preventDefault();
                  onPlan(document.getElementById("panchi-search")?.value || "");
                }}
                title="Let Panchi plan"
              >
                <span className="cta-text">Let Panchi plan →</span>
              </button>
            </div>
          </div>

          <div className="hero-right">
            <img
              src="/panchi-logo.png"
              alt="Panchi logo"
              className="brand-logo"
            />
          </div>
        </div>
      </header>

      <style jsx>{`
        .header {
          padding: 36px 20px 10px;
        }
        .header-inner {
          max-width: 1180px;
          margin: 0 auto;
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        .hero-left {
          flex: 1 1 60%;
          min-width: 300px;
        }
        .hero-right {
          width: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .greet {
          margin: 0 0 6px;
          color: #111827;
          font-size: 14px;
        }
        .title {
          margin: 0 0 10px;
          font-size: 42px;
          line-height: 1.04;
          color: #0f172a;
        }
        .subtitle {
          margin: 0 0 18px;
          color: #374151;
          max-width: 780px;
        }

        .search-row {
          display: flex;
          gap: 12px;
          align-items: center;
          width: 100%;
        }

        .search-input {
          flex: 1 1 auto;
          min-width: 0;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid #e6e9ef;
          background: #ffffff;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
          font-size: 16px;
          color: #0f172a;
        }

        .search-input::placeholder {
          color: #9aa4b2;
        }

        /* CTA: ensures text always visible and accessible */
        .cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 18px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          min-width: 160px;
          background: linear-gradient(90deg, #7a5cf4 0%, #ff6fb1 100%);
          color: #fff;
          font-weight: 700;
          box-shadow: 0 12px 30px rgba(122, 92, 244, 0.12);
        }

        .cta:focus {
          outline: 3px solid rgba(122, 92, 244, 0.18);
          outline-offset: 3px;
        }

        .cta-text {
          font-size: 15px;
          letter-spacing: 0.1px;
        }

        .brand-logo {
          max-width: 200px;
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        /* Responsive */
        @media (max-width: 940px) {
          .header-inner {
            flex-direction: column;
            align-items: stretch;
          }
          .hero-right {
            width: 160px;
            margin-top: 12px;
            align-self: flex-end;
          }
          .title {
            font-size: 34px;
          }
        }

        @media (max-width: 520px) {
          .title {
            font-size: 26px;
          }
          .cta {
            min-width: 120px;
            padding: 10px 12px;
          }
          .search-row {
            flex-direction: column;
            gap: 10px;
          }
          .hero-right {
            align-self: center;
            width: 140px;
          }
        }
      `}</style>
    </>
  );
}
