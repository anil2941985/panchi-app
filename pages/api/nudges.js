// pages/api/nudges.js
export default function handler(req, res) {
  const nudges = [
    { id: "n1", title: "Rain alert — Baga / Calangute", text: "Light rain Saturday evening; prefer inland stays." },
    { id: "n2", title: "Price surge likely next Fri", text: "Searches up for DEL → GOI. Book early to save ~10–18%." },
    { id: "n3", title: "Traffic at Delhi T3 (Evening)", text: "Allow 30–45 mins extra to reach the airport." }
  ];
  res.status(200).json({ nudges });
}
