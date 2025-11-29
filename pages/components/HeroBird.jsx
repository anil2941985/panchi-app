// pages/components/HeroBird.jsx
import React from "react";

/**
 * Simple HeroBird component — SVG bird with small wing/flight animation.
 * Saves having external assets and avoids missing-file build errors.
 */

export default function HeroBird({ width = 120, className = "" }) {
  const style = {
    display: "inline-block",
    width: width,
    height: "auto",
    transformOrigin: "center",
  };

  return (
    <div
      className={`hero-bird ${className}`}
      style={{ ...style, willChange: "transform, opacity" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 80"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#00A7FF" />
            <stop offset="60%" stopColor="#00D1A7" />
            <stop offset="100%" stopColor="#FF8AC0" />
          </linearGradient>
          <linearGradient id="g2" x1="0" x2="1">
            <stop offset="0%" stopColor="#FFB347" />
            <stop offset="100%" stopColor="#FF7EB3" />
          </linearGradient>
        </defs>

        {/* Body */}
        <g transform="translate(10,10)">
          <ellipse cx="45" cy="30" rx="26" ry="18" fill="url(#g1)" />
          {/* Wing */}
          <path
            className="wing"
            d="M45 22 C65 5, 85 5, 95 18 C84 30, 62 34, 45 28 Z"
            fill="url(#g2)"
            opacity="0.98"
          />
          {/* Beak */}
          <path d="M70 30 L78 27 L74 32 Z" fill="#FFCC4D" />
          {/* Tail */}
          <path d="M22 30 C12 20, 6 16, 0 10 L6 24 C12 28, 18 30, 22 30 Z" fill="#0077C2" />
        </g>
      </svg>

      <style jsx>{`
        .hero-bird {
          animation: floatY 3.6s ease-in-out infinite;
        }
        .hero-bird .wing {
          transform-origin: 68px 24px;
          animation: flap 0.9s ease-in-out infinite;
        }

        @keyframes floatY {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes flap {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(-12deg) scaleY(0.98); }
          100% { transform: rotate(0deg); }
        }

        /* Small screens — scale down */
        @media (max-width: 640px) {
          .hero-bird { width: ${Math.min(width, 84)}px; }
        }
      `}</style>
    </div>
  );
}
