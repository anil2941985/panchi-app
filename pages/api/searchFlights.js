// pages/api/searchFlights.js
// Mock flight search API. Replace with real provider later.
export default function handler(req, res) {
  const { q = "Goa", date = "2025-11-29" } = req.query;

  const flights = [
    { id: "f1", airline: "IndiAir", depart: "DEL 06:00", arrive: "GOI 08:05", dur: "2h 5m", price: 3499, mood: "GOOD" },
    { id: "f2", airline: "SkyWays", depart: "DEL 09:00", arrive: "GOI 11:05", dur: "2h 5m", price: 4299, mood: "FAIR" },
    { id: "f3", airline: "BudgetAir", depart: "DEL 17:15", arrive: "GOI 19:20", dur: "2h 5m", price: 2999, mood: "OK" }
  ];

  res.status(200).json({
    destination: q,
    date,
    results: flights
  });
}
