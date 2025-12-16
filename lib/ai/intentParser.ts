// lib/ai/intentParser.ts
// FULL FILE REPLACEMENT – DO NOT MERGE PARTIALLY

export type TravelIntent = {
  destination: string | null;
  budget: {
    max: number | null;
    currency: string;
  };
  duration: number | null;
  month: string | null;
  travel_type: "leisure" | "adventure" | "family" | null;
  constraints: string[];
  confidence: number;
};

const MONTHS = [
  "january","february","march","april","may","june",
  "july","august","september","october","november","december"
];

const DESTINATIONS = [
  "goa","manali","jaipur","udaipur","shimla","mussoorie",
  "gokarna","tirthan","kasol","jaisalmer","rishikesh"
];

export function parseIntent(input: string): TravelIntent {
  const text = input.toLowerCase();
  let confidence = 0.4;
  const constraints: string[] = [];

  // ---- Destination ----
  let destination: string | null = null;
  for (const d of DESTINATIONS) {
    if (text.includes(d)) {
      destination = capitalize(d);
      confidence += 0.2;
      break;
    }
  }

  // ---- Budget ----
  let budgetMax: number | null = null;
  const budgetMatch = text.match(/(under|below)\s*₹?\s*(\d+)\s*k?/);
  if (budgetMatch) {
    const value = parseInt(budgetMatch[2], 10);
    budgetMax = text.includes("k") ? value * 1000 : value;
    constraints.push("budget");
    confidence += 0.2;
  }

  // ---- Duration ----
  let duration: number | null = null;
  if (text.includes("weekend")) {
    duration = 2;
    constraints.push("time");
    confidence += 0.1;
  }
  const dayMatch = text.match(/(\d+)\s*(day|days|n)/);
  if (dayMatch) {
    duration = parseInt(dayMatch[1], 10);
    constraints.push("time");
    confidence += 0.15;
  }

  // ---- Month / Season ----
  let month: string | null = null;
  for (const m of MONTHS) {
    if (text.includes(m)) {
      month = capitalize(m);
      confidence += 0.1;
      break;
    }
  }
  if (text.includes("next month")) {
    month = "next_month";
    confidence += 0.05;
  }

  // ---- Travel Type ----
  let travel_type: TravelIntent["travel_type"] = null;
  if (text.includes("family")) travel_type = "family";
  if (text.includes("adventure")) travel_type = "adventure";
  if (text.includes("relax") || text.includes("peaceful")) travel_type = "leisure";

  if (travel_type) confidence += 0.05;

  confidence = Math.min(confidence, 0.95);

  return {
    destination,
    budget: {
      max: budgetMax,
      currency: "INR",
    },
    duration,
    month,
    travel_type,
    constraints,
    confidence,
  };
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
