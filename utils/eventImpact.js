// utils/eventImpact.js

// This function adjusts travel scores based on event severity & characteristics.
export function evaluateEventImpact(events, destination) {
  const relevantEvents = events.filter(
    (ev) => ev.location.toLowerCase().includes(destination.toLowerCase())
  );

  // No events? No penalty.
  if (relevantEvents.length === 0) {
    return {
      eventSummary: null,
      penalties: { flight: 0, train: 0, bus: 0, cab: 0 },
    };
  }

  let penalties = { flight: 0, train: 0, bus: 0, cab: 0 };
  let summary = [];

  relevantEvents.forEach((ev) => {
    // Base penalty per severity
    const sev = ev.severity === "high" ? 30 : ev.severity === "medium" ? 15 : 5;

    summary.push({
      title: ev.title,
      impact: ev.impact,
      recommendation: ev.recommendedAction,
      severity: ev.severity,
    });

    // Apply penalties based on event type
    if (ev.category === "music") {
      // Music festivals → beach congestion → cab surge → flight delays at peak hours
      penalties.cab += sev + 10;
      penalties.flight += sev / 2;
    }

    if (ev.category === "sports") {
      // IPL finals → huge crowds, hotel surge → prefer trains
      penalties.flight += sev + 15;
      penalties.cab += sev;
      penalties.bus += sev;
    }

    if (ev.category === "religious") {
      // Religious events → road blocks → train safest
      penalties.cab += sev + 20;
      penalties.bus += sev + 10;
    }

    if (ev.category === "culture") {
      // Moderate effect
      penalties.cab += sev / 2;
    }
  });

  return {
    eventSummary: summary,
    penalties,
  };
}
