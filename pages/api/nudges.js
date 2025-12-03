// pages/api/nudges.js
export default function handler(req, res) {
  const nudges = [
    { id: "n1", title: "Rain alert — Baga / Calangute", text: "Light rain Saturday evening; prefer inland stays for a quiet morning." },
    { id: "n2", title: "Price surge likely next Fri", text: "Searches spiking for DEL → GOI. Book before 4 PM today to save ~10–18%." },
    { id: "n3", title: "Traffic at Delhi T3 (Evening)", text: "Allow 30–45 mins extra to reach the airport during evening rush." }
  ];
  res.status(200).json({ nudges });
}
