// pages/api/mockBuses.js

export default function handler(req, res) {
  // Simple mock buses for DEL -> GOA overnight routes (illustrative only)
  const buses = [
    {
      operator: "VRL Travels",
      type: "AC Sleeper",
      depart: "17:30",
      arrive: "09:00",
      duration: "15h 30m",
      rating: 4.5,
      price: 1800,
    },
    {
      operator: "Prasanna Tours",
      type: "Non-AC Sleeper",
      depart: "18:45",
      arrive: "11:00",
      duration: "16h 15m",
      rating: 4.2,
      price: 1350,
    },
    {
      operator: "RedBus Partner",
      type: "AC Semi-Sleeper",
      depart: "21:00",
      arrive: "11:30",
      duration: "14h 30m",
      rating: 4.0,
      price: 1550,
    },
  ];

  const sorted = buses.sort((a, b) => a.price - b.price);
  res.status(200).json(sorted);
}
