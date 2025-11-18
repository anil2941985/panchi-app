import { useEffect, useState } from "react";

export default function Trains() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrains();
  }, []);

  async function fetchTrains() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mockTrains");
      if (!res.ok) throw new Error("Failed to load trains");
      const data = await res.json();
      setTrains(data);
    } catch (err) {
      console.error(err);
      setError("Could not load trains right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const cheapest = trains[0];

  return (
    <main
      style={{
        fontFamily: "Poppins,
