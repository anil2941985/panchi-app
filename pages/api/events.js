// pages/api/events.js
export default function handler(req, res) {
  const events = [
    { id: "e1", title: "Sunburn-esque EDM Festival - Vagator", date: "2025-12-28", severity: "HIGH", advice: "Hotels +30% · Cab surge likely" },
    { id: "e2", title: "Classical Music Fest - Thiruvananthapuram", date: "2025-11-09", severity: "MEDIUM", advice: "Boutique hotels fill fast" },
    { id: "e3", title: "Grand Durga Visarjan - Kolkata", date: "2025-10-08", severity: "HIGH", advice: "Avoid main processions; use metro where possible." }
  ];
  res.status(200).json({ items: events });
}
