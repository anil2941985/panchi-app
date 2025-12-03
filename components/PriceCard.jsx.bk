// pages/components/PriceCard.jsx
import React from "react";

/**
 * PriceCard
 * Generic card for displaying flight/train/cab options
 *
 * Props:
 * - title      → IndiGo / Vande Bharat / Uber Go
 * - subtitle   → DEL → GOI • 2h 5m (or ETA, timings, etc)
 * - price      → "₹3499"
 * - actionText → "Book" or "Details"
 */

export default function PriceCard({
  title = "Service",
  subtitle = "",
  price = "",
  actionText = "Book",
}) {
  return (
    <div className="pcard">
      <div className="left">
        <div className="title">{title}</div>
        {subtitle && <div className="subtitle">{subtitle}</div>}
      </div>

      <div className="right">
        <div className="price">{price}</div>
        <button className="book-btn">{actionText}</button>
      </div>

      <style jsx>{`
        .pcard {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 18px;
          border-radius: 16px;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.9),
            rgba(247, 247, 255, 0.9)
          );
          border: 1px solid rgba(20, 20, 40, 0.06);
          box-shadow: 0 6px 22px rgba(20, 20, 40, 0.06);
          transition: 0.2s ease;
          cursor: pointer;
        }

        .pcard:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(20, 20, 40, 0.12);
        }

        /* Left section */
        .left {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }

        .title {
          font-weight: 700;
          font-size: 15px;
          color: #111827;
        }

        .subtitle {
          font-size: 13px;
          color: #6b7280;
        }

        /* Right section */
        .right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          min-width: 70px;
        }

        .price {
          font-size: 16px;
          font-weight: 800;
          background: linear-gradient(90deg, #6a5af9, #ff6ea8);
          -webkit-background-clip: text;
          color: transparent;
        }

        .book-btn {
          padding: 6px 14px;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(90deg, #7c4dff, #ff68a1);
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(124, 77, 255, 0.2);
          transition: 0.15s ease;
        }

        .book-btn:active {
          transform: scale(0.95);
        }

        /* Mobile styles */
        @media (max-width: 640px) {
          .pcard {
            padding: 14px;
          }

          .title {
            font-size: 14px;
          }

          .price {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}
