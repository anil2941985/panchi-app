// pages/components/HeroBird.jsx
import React from "react";

export default function HeroBird({ className = "" }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#00A3FF" />
            <stop offset="50%" stopColor="#FF6A9E" />
            <stop offset="100%" stopColor="#FFB86E" />
          </linearGradient>
        </defs>

        <g transform="translate(20,20)">
          {/* wing */}
          <path d="M10 40 C 30 0, 70 0, 90 40 C 70 20, 40 60, 10 40" fill="url(#g1)">
            <animate attributeName="transform" dur="2s" repeatCount="indefinite" values="translate(0,0) rotate(-5); translate(0,-4) rotate(3); translate(0,0) rotate(-5)" />
          </path>

          {/* body */}
          <ellipse cx="110" cy="40" rx="30" ry="18" fill="#ffd27f">
            <animate attributeName="cx" dur="4s" repeatCount="indefinite" values="110;120;110" />
          </ellipse>

          {/* tail */}
          <path d="M140 45 L160 50 L140 55 Z" fill="#00A3FF" opacity="0.9">
            <animate attributeName="transform" dur="1.5s" repeatCount="indefinite" values="rotate(0 150 50); rotate(-12 150 50); rotate(0 150 50)" />
          </path>

          {/* eye */}
          <circle cx="120" cy="36" r="2" fill="#333" />
        </g>
      </svg>
    </div>
  );
}
