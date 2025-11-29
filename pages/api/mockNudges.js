// pages/api/mockNudges.js

export default function handler(req, res) {
  // Mock AI-style nudges for India travel (sample Delhi / Goa / Jaipur)
  const nudges = [
    {
      id: 1,
      icon: "🌧️",
      title: "Rain alert in Goa this weekend",
      detail:
        "Light rain expected on Saturday evening around Baga–Calangute stretch.",
      impact:
        "Panchi suggests doing beach + water sports on Sunday morning instead.",
      type: "weather",
    },
    {
      id: 2,
      icon: "🔥",
      title: "Flight surge likely for Goa next Friday",
      detail:
        "Searches are spiking for DEL → GOI for the coming long weekend.",
      impact:
        "Booking before 4 PM today could save you 10–18% vs tomorrow’s prices.",
      type: "pricing",
    },
    {
      id: 3,
      icon: "🚦",
      title: "High traffic near Delhi airport (T3) during evening peak",
      detail:
        "Construction + office traffic between 5 PM–8 PM on NH-48 towards IGI.",
      impact:
        "Panchi nudges you to leave 25–30 min earlier for evening departures.",
      type: "traffic",
    },
    {
      id: 4,
      icon: "🎵",
      title: "Sunburn-style festival in Goa – crowd & hotel spike",
      detail:
        "EDM festival announced near Vagator in the last week of December.",
      impact:
        "Expect higher demand for cabs & stays. Good time if you like events, avoid if you prefer quiet beaches.",
      type: "event",
    },
  ];

  res.status(200).json(nudges);
}
