// pages/components/HeroBird.jsx
import React, { useEffect, useState } from 'react';

/**
 * HeroBird:
 * - Server-safe: renders a static SVG markup on the server.
 * - On the client, it adds a gentle CSS animation (flight / bob).
 * - Lightweight, no external libs.
 */
export default function HeroBird() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  return (
    <div className={`hero-bird ${isClient ? 'client' : 'ssr'}`} aria-hidden>
      <svg viewBox="0 0 120 120" width="140" height="70" role="img" aria-label="Panchi bird">
        <g transform="translate(8,6)">
          {/* simple colorful bird mark */}
          <path d="M6 46c8-24 38-40 64-28-10 10-24 18-40 26-10 5-20 12-24 18-6-8-6-16-0-36z" fill="#1ea7ff" />
          <path d="M74 6c10 6 18 16 20 28-8 2-18 2-28-2 4-10 6-18 8-26z" fill="#ff9a5b" />
          <circle cx="54" cy="32" r="5" fill="#ffd166" />
        </g>
      </svg>

      <style jsx>{`
        .hero-bird { display:flex; align-items:center; justify-content:center; overflow:visible; }
        /* gentle flight bob when client */
        .hero-bird.client svg { animation: bird-fly 6s ease-in-out infinite; transform-origin: 50% 50%; }
        @keyframes bird-fly {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-6px) rotate(-2deg) scale(1.02); }
          50% { transform: translateY(0px) rotate(0deg) scale(1); }
          75% { transform: translateY(-4px) rotate(1deg) scale(1.01); }
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }
        /* smaller on narrow screens */
        @media (max-width:640px) {
          .hero-bird svg { width: 110px; height:58px; }
        }
      `}</style>
    </div>
  );
}
