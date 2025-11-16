export default function handler(req, res) {
  const cabs = [
    { provider: "Local Taxi", price: 220, eta: 10, rating: 4.6 },
    { provider: "Ola", price: 249, eta: 15, rating: 4.4 },
    { provider: "Uber", price: 265, eta: 12, rating: 4.5 }
  ];

  // sort by price
  const sorted = cabs.sort((a, b) => a.price - b.price);

  res.status(200).json(sorted);
}
