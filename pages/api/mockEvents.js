// pages/api/mockEvents.js

export default function handler(req, res) {
  // Mock upcoming events across India
  const events = [
    {
      id: 1,
      title: "Sunburn-esque EDM Festival",
      location: "Vagator, Goa",
      date: "2025-12-28",
      impact: "High crowding · Hotels +30% · Cab surge likely",
      detail:
        "Multi-day EDM festival near Vagator. Expect busy beaches, limited hostel availability and cab surge during event nights.",
      category: "music",
      severity: "high",
      recommendedAction: "Book hotels + cabs now if attending; avoid beachfront stays if you want quiet.",
    },
    {
      id: 2,
      title: "IPL Playoffs (Sample)",
      location: "Mumbai",
      date: "2026-05-20",
      impact: "High hotel & flight demand · Local transport crowded",
      detail:
        "Cricket playoff week — city will host many travelers. Last-mile traffic and ride-hailing surge expected around match times.",
      category: "sports",
      severity: "high",
      recommendedAction:
        "If visiting for the match, book transport ahead and plan longer arrival buffers to stadiums.",
    },
    {
      id: 3,
      title: "Classical Music Fest",
      location: "Thiruvananthapuram",
      date: "2025-11-09",
      impact: "Moderate; few boutique hotels fill fast",
      detail:
        "Renowned classical musicians performing across the city. Great for cultural travellers; quieter than big festivals.",
      category: "culture",
      severity: "medium",
      recommendedAction:
        "Book boutique stays early; inland transport is smooth but limited late-night cabs.",
    },
    {
      id: 4,
      title: "Grand Durga Visarjan",
      location: "Kolkata",
      date: "2025-10-08",
      impact: "Large crowds · road diversions · metro rush",
      detail:
        "Religious procession & visarjan events — expect local transport delays and road closures in event areas.",
      category: "religious",
      severity: "high",
      recommendedAction:
        "Avoid travel through processions; use metro where possible and check local advisories.",
    }
  ];

  res.status(200).json(events);
}
