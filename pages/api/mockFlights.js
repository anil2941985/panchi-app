export default function handler(req, res) {
  const { origin = "DEL", destination = "GOI" } = req.query;

  // Simple richer mock dataset for DEL -> GOI
  // timeBand: morning / afternoon / evening / night
  // stops: 0 = non-stop, 1+ = connecting
  const flights = [
    {
      origin: "DEL",
      destination: "GOI",
      provider: "IndiGo",
      flight_no: "6E-123",
      depart: "06:15",
      arrive: "08:20",
      duration: "2h 05m",
      price: 2899,
      timeBand: "morning",
      stops: 0,
    },
    {
      origin: "DEL",
      destination: "GOI",
      provider: "SpiceJet",
      flight_no: "SG-452",
      depart: "11:45",
      arrive: "14:00",
      duration: "2h 15m",
      price: 3050,
      timeBand: "afternoon",
      stops: 0,
    },
    {
      origin: "DEL",
      destination: "GOI",
      provider: "Vistara",
      flight_no: "UK-887",
      depart: "18:30",
      arrive: "20:45",
      duration: "2h 15m",
      price: 3200,
      timeBand: "evening",
      stops: 0,
    },
    {
      origin: "DEL",
      destination: "GOI",
      provider: "Air India",
      flight_no: "AI-509",
      depart: "21:15",
      arrive: "23:55",
      duration: "2h 40m",
      price: 3100,
      timeBand: "night",
      stops: 1, // 1 stop (connecting)
    },
  ];

  const filtered = flights.filter(
    (f) => f.origin === origin && f.destination === destination
  );

  const result = (filtered.length ? filtered : flights).sort(
    (a, b) => a.price - b.price
  );

  res.status(200).json(result);
}
