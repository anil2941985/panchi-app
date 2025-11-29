// utils/api.js
export async function searchFlights({ to = "Goa" } = {}) {
  // NOTE: Replace with your real provider endpoint + key.
  // Example using RapidAPI/SkyScanner style (you must sign up and set env var RAPIDAPI_KEY)
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";
  const endpoint = process.env.FLIGHTS_ENDPOINT || ""; // e.g. 'https://skyscanner-.../search'

  if (!RAPIDAPI_KEY || !endpoint) {
    // Running without real provider — return a mocked dataset for offline dev
    return [
      { id: "f1", airline: "IndiAir", depart: "DEL 06:00", arrive: `${to} 08:05`, duration: "2h 5m", price: 3499, nudge: "GOOD" },
      { id: "f2", airline: "SkyWays", depart: "DEL 09:00", arrive: `${to} 11:05`, duration: "2h 5m", price: 4299, nudge: "FAIR" },
      { id: "f3", airline: "BudgetAir", depart: "DEL 17:15", arrive: `${to} 19:20`, duration: "2h 5m", price: 2999, nudge: "CHEAP" },
    ];
  }

  // Example call — modify to provider's required query format
  try {
    const resp = await fetch(`${endpoint}?to=${encodeURIComponent(to)}`, {
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": new URL(endpoint).hostname,
      },
      next: { revalidate: 30 },
    });

    if (!resp.ok) throw new Error("Provider failed");
    const payload = await resp.json();
    // map provider-specific data -> our internal format
    // (you will need to adapt this block to the provider response)
    return payload.results || payload.flights || [];
  } catch (err) {
    console.error("real provider error", err);
    // fallback to mock
    return [
      { id: "f1", airline: "IndiAir", depart: "DEL 06:00", arrive: `${to} 08:05`, duration: "2h 5m", price: 3499, nudge: "GOOD" },
      { id: "f2", airline: "SkyWays", depart: "DEL 09:00", arrive: `${to} 11:05`, duration: "2h 5m", price: 4299, nudge: "FAIR" },
      { id: "f3", airline: "BudgetAir", depart: "DEL 17:15", arrive: `${to} 19:20`, duration: "2h 5m", price: 2999, nudge: "CHEAP" },
    ];
  }
}
