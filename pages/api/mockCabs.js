export default function handler(req, res) {
  // Simple mock cab options for MVP
  const cabs = [
    { provider: "Local Taxi", price: 220, eta: 10, rating: 4.6 },
    { provider: "Ola Mini", price: 249, eta: 12, rating: 4.4 },
    { provider: "Uber Go", price: 265, eta: 9, rating: 4.5 },
  ];

  const sorted = cabs.sort((a, b) => a.price - b.price);
  res.status(200).json(sorted);
}
