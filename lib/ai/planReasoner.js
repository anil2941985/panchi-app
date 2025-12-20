// lib/ai/planReasoner.js
// FULL FILE REPLACEMENT – PLAN REASONER v1

export function buildPlan(intent) {
  const {
    destination,
    duration,
    budget,
    travel_type
  } = intent;

  const days = duration || 3;
  const totalBudget = budget?.max || 15000;

  // ---- Budget Split Logic ----
  const budgetSplit = {
    stay: Math.round(totalBudget * 0.45),
    travel: Math.round(totalBudget * 0.35),
    food: Math.round(totalBudget * 0.2)
  };

  // ---- Day-wise Plan ----
  const itinerary = [];
  for (let i = 1; i <= days; i++) {
    itinerary.push({
      day: i,
      title: `Day ${i} in ${destination || "your destination"}`,
      activities: getActivities(destination, travel_type, i)
    });
  }

  // ---- Explainability ----
  const explanation = generateExplanation(intent, days, totalBudget);

  // ---- Alternatives ----
  const alternatives = getAlternatives(destination, totalBudget);

  return {
    destination,
    duration: days,
    totalBudget,
    budgetSplit,
    itinerary,
    whyThisPlan: explanation,
    alternatives
  };
}

// ---------- Helpers ----------

function getActivities(destination, travel_type, day) {
  const base = [
    "Local sightseeing",
    "Explore nearby attractions",
    "Relax and enjoy local food"
  ];

  if (travel_type === "adventure") {
    base.push("Light adventure activity");
  }

  if (travel_type === "family") {
    base.push("Family-friendly outing");
  }

  if (day === 1) return ["Arrival & hotel check-in", ...base];
  if (day === 3) return [...base, "Souvenir shopping"];

  return base;
}

function generateExplanation(intent, days, budget) {
  const parts = [];

  if (intent.destination) {
    parts.push(`We chose ${intent.destination} based on your interest`);
  }

  if (intent.constraints.includes("budget")) {
    parts.push(`This plan comfortably fits within your ₹${budget} budget`);
  }

  parts.push(`${days} days gives a relaxed pace without rushing`);

  return parts.join(". ") + ".";
}

function getAlternatives(destination, budget) {
  const map = {
    Goa: ["Gokarna", "Varkala"],
    Manali: ["Tirthan Valley", "Kasol"],
    Jaipur: ["Udaipur", "Jodhpur"]
  };

  return (map[destination] || ["Udaipur", "Rishikesh"]).map(place => ({
    destination: place,
    reason: `Similar experience under ₹${budget}`
  }));
}
