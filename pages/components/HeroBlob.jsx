// pages/components/HeroBlob.jsx
import React from "react";

/**
 * HeroBlob - decorative top-right blurred gradient blob.
 * Lightweight inline SVG (no external assets).
 */
export default function HeroBlob({ className = "hero-blob" }) {
  return (
    <div className={className} aria-hidden="true" role="img">
      <svg
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
        width="400"
        height="260"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffd6f0" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#caa7ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#b3f0ff" stopOpacity="0.85" />
          </linearGradient>

          <filter id="blurMe" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        <g filter="url(#blurMe)">
          <path
            d="M84 12c45-8 110 2 156 28 46 26 74 84 60 134-14 50-71 80-120 90-49 9-99-6-142-30C20 201 3 146 15 106 27 66 44 28 84 12z"
            fill="url(#g1)"
            opacity="0.95"
          />
        </g>
      </svg>
    </div>
  );
}
