// pages/api/mockHotPlaces.js

export default function handler(req, res) {
  const hotPlaces = [
    {
      id: 1,
      title: "Goa",
      emoji: "🏖️",
      reason: "Perfect weather + off-peak weekday flight deals",
      temp: "26–30°C",
      trend: "Searches up 42%",
      budget: "₹6,000–₹8,500",
      vibe: "beach"
    },
    {
      id: 2,
      title: "Rishikesh",
      emoji: "🏞️",
      reason: "Great rafting season, clear skies",
      temp: "12–20°C",
      trend: "Trending among solo travellers",
      budget: "₹3,500–₹5,000",
      vibe: "mountain"
    },
    {
      id: 3,
      title: "Udaipur",
      emoji: "🏰",
      reason: "Low hotel prices + wedding season buzz",
      temp: "18–24°C",
      trend: "Instagram reels boost +27%",
      budget: "₹4,500–₹7,000",
      vibe: "culture"
    },
    {
      id: 4,
      title: "Andaman",
      emoji: "🌊",
      reason: "Crystal-clear water season, fewer tourists",
      temp: "25–28°C",
      trend: "Great for honeymooners",
      budget: "₹12,000–₹18,000",
      vibe: "island"
    }
  ];

  res.status(200).json(hotPlaces);
}
