// pages/api/events.js
export default function handler(req, res) {
  const events = [
    { id: "e1", title: "EDM Festival - Vagator", date: "2025-12-28", severity: "HIGH", advice: "Hotels +30% · Cab surge likely" },
    { id: "e2", title: "Classical Music Fest - Trivandrum", date: "2025-11-09", severity: "MEDIUM", advice: "Boutique hotels fill fast" }
  ];
  res.status(200).json({ items: events });
}
