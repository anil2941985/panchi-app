export default function handler(req, res) {
  // Very simple mock for now – later we can replace with real API
  const { origin = "DEL", destination = "GOI" } = req.query;

  const flights = [
    {
      origin: "DEL",
      destination: "GOI",
      provider: "IndiGo",
      flight_no: "6E-123",
      depart: "06:15",
      arrive: "08:20",
      duration: "2h 05m",
      price: 2899
    },
    {
      origin: "DEL",
      destination: "GOI",
      provider: "SpiceJet",
      flight_no: "SG-452",
      depart: "07:45",
      arrive: "09:55",
      duration: "2h 10m",
      price: 3150
    },
    {
      origin: "DEL",
      destination: "GOI",
      provider: "Vistara",
      flight_no: "UK-887",
      depart: "10:00",
      arrive: "12:10",
      duration: "2h 10m",
      price: 3400
    }
  ];

  const filtered = flights.filter(
    f => f.origin === origin && f.destination === destination
  );

  // Sort by price ascending and return
  const sorted = (filtered.length ? filtered : flights).sort(
    (a, b) => a.price - b.price
  );

  res.status(200).json(sorted);
}
