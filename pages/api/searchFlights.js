// pages/api/searchFlights.js
import { searchFlights } from "../../utils/api";

export default async function handler(req, res) {
  try {
    const { to = "Goa" } = req.query;
    // server-side: call your provider (the helper handles keys)
    const flights = await searchFlights({ to });

    // Normalize result to minimal fields required by UI
    const normalized = (flights || []).map((f, i) => ({
      id: f.id || `f${i}`,
      airline: f.airline || f.carrier || "SampleAir",
      depart: f.depart || "DEL 06:00",
      arrive: f.arrive || `${to} 08:05`,
      duration: f.duration || "2h 5m",
      price: f.price || (2000 + Math.floor(Math.random()*3000)),
      nudge: f.nudge || "GOOD",
    }));

    res.status(200).json({ flights: normalized });
  } catch (err) {
    console.error("searchFlights error:", err);
    res.status(500).json({ error: "failed" });
  }
}
