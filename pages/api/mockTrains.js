export default function handler(req, res) {
  // Simple mock trains for DEL -> GOI direction (Goa via Madgaon)
  // timings and prices are illustrative only
  const trains = [
    {
      name: "Vande Bharat Express",
      number: "22229",
      depart: "06:10",
      arrive: "19:45",
      duration: "13h 35m",
      class: "CC / EC",
      price: 1850,
      rating: 4.7,
    },
    {
      name: "Jan Shatabdi Express",
      number: "12051",
      depart: "13:20",
      arrive: "03:40",
      duration: "14h 20m",
      class: "2S / CC",
      price: 1350,
      rating: 4.4,
    },
    {
      name: "Konkan Kanya Express",
      number: "10111",
      depart: "18:20",
      arrive: "09:15",
      duration: "14h 55m",
      class: "SL / 3A / 2A",
      price: 1100,
      rating: 4.2,
    },
  ];

  const sorted = trains.sort((a, b) => a.price - b.price);
  res.status(200).json(sorted);
}
