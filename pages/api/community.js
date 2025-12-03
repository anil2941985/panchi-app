// pages/api/community.js
export default function handler(req, res) {
  const quickTakes = [
    { id: "c1", author: "Asha", text: "Loved morning at Baga, crowd manageable." },
    { id: "c2", author: "Rajan", text: "Road diversions in festival season; allow extra time." }
  ];
  res.status(200).json({ quickTakes });
}
