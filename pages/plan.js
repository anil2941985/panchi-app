// pages/plan.js
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

/**
 * Panchi - Plan page (full replacement)
 * - Tailwind classes used (assumes Tailwind configured)
 * - Self-contained mock data functions included (no external fetch)
 * - Responsive card layout, nudges sidebar, events list, trending cards
 */

/* ---------------------------
   MOCK DATA HELPERS
   --------------------------- */

function mockNudges() {
  return [
    {
      id: "n1",
      type: "weather",
      title: "Rain alert in Goa this weekend",
      detail: "Light rain expected on Saturday evening around Baga–Calangute stretch.",
      severity: "medium",
      icon: "☔",
    },
    {
      id: "n2",
      type: "pricing",
      title: "Flight surge likely for Goa next Friday",
      detail: "Searches spiking for DEL → GOI; booking earlier can save 10–18%.",
      severity: "high",
      icon: "🔥",
    },
    {
      id: "n3",
      type: "traffic",
      title: "High traffic near Delhi airport (T3) during evening peak",
      detail: "Expect 30–45 min extra drive time 5 PM–8 PM on NH-48 towards IGI.",
      severity: "medium",
      icon: "🚦",
    },
  ];
}

function mockEvents(destination = "Goa") {
  // some events - some tuned to the destination to simulate local crowding
  return [
    {
      id: "e1",
      title: "Sunburn-style EDM Festival",
      location: "Vagator, Goa",
      date: "2025-12-28",
      severity: "high",
      impact: "High crowding — hotels +30%; cab surge likely",
    },
    {
      id: "e2",
      title: "IPL Playoffs (Sample)",
      location: "Mumbai",
      date: "2026-05-20",
      severity: "high",
      impact: "High demand for flights and hotels; local transport crowded",
    },
    {
      id: "e3",
      title: "Classical Music Fest",
      location: "Thiruvananthapuram",
      date: "2025-11-09",
      severity: "medium",
      impact: "Few boutique hotels fill quickly; inland transport smooth",
    },
  ].filter(Boolean);
}

function mockTrending() {
  return [
    {
      id: "t1",
      title: "Goa",
      subtitle: "Perfect weather + off-peak weekday flight deals",
      priceRange: "₹6,000–₹8,500",
      tag: "Popular",
      image: "/placeholder-trip.jpg",
    },
    {
      id: "t2",
      title: "Rishikesh",
      subtitle: "Rafting season — clear skies",
      priceRange: "₹3,500–₹5,000",
      tag: "Popular",
      image: "/placeholder-trip.jpg",
    },
    {
      id: "t3",
      title: "Jaipur",
      subtitle: "Heritage stays & forts",
      priceRange: "₹2,000–₹6,000",
      tag: "Culture",
      image: "/placeholder-trip.jpg",
    },
  ];
}

function mockFlights(dest) {
  // simple, deterministic-ish mock flights
  return [
    { id: "f1", carrier: "IndiAir", depart: "DEL 06:00", arrive: `${dest} 08:05`, duration: "2h 5m", price: 3499 },
    { id: "f2", carrier: "SkyWays", depart: "DEL 09:00", arrive: `${dest} 11:05`, duration: "2h 5m", price: 4299 },
    { id: "f3", carrier: "BudgetAir", depart: "DEL 17:15", arrive: `${dest} 19:20`, duration: "2h 5m", price: 2999 },
  ];
}

function mockTrains(dest) {
  return [
    { id: "t1", name: "Konkan Kanya Express", no: "10111", depart: "18:20", arrive: "09:15", duration: "14h 55m", class: "SL/3A/2A", price: 1100 },
    { id: "t2", name: "Jan Shatabdi", no: "12051", depart: "13:20", arrive: "03:40", duration: "14h 20m", class: "2S/CC", price: 1350 },
    { id: "t3", name: "Vande Bharat Express", no: "22229", depart: "06:10", arrive: "19:45", duration: "13h 35m", class: "CC/EC", price: 1850 },
  ];
}

function mockCabs(dest) {
  return [
    { id: "c1", provider: "Local Taxi", eta: "10 min", rating: 4.6, price: 220 },
    { id: "c2", provider: "Ola Mini", eta: "12 min", rating: 4.4, price: 249 },
    { id: "c3", provider: "Uber Go", eta: "9 min", rating: 4.5, price: 265 },
  ];
}

function synthTrendData(dest) {
  // returns 7-day minimal trend data
  const today = new Date();
  const arr = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    arr.push({
      date: d.toISOString().slice(0, 10),
      priceIndex: Math.round((0.45 + Math.random() * 0.5) * 100),
      weatherScore: Math.round(Math.random() * 100),
    });
  }
  return arr;
}

/* ---------------------------
   UI Subcomponents
   --------------------------- */

function Header({ dest, userName }) {
  return (
    <div className="mb-6 bg-white/60 backdrop-blur-md rounded-xl p-6 shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-600">Hey, {userName || "there"}</div>
          <h1 className="text-3xl font-extrabold leading-tight">Where are we going next?</h1>
          <p className="mt-2 text-gray-600 max-w-xl">
            Panchi will find the smartest and cheapest ways to reach your destination — starting with flights in
            this MVP, and later adding trains, buses and cabs.
          </p>
        </div>
        <div className="hidden md:flex items-center">
          <img src="/panchi-logo.png" alt="Panchi logo" className="w-28 h-12 object-contain" />
        </div>
      </div>
      <div className="mt-6 flex gap-4 items-center">
        <input
          id="destination-input"
          placeholder={`Try "Goa", "Manali", "Jaipur" or "beach under 5k"`}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-400 text-white font-semibold shadow-lg">
          Let Panchi plan →
        </button>
      </div>
    </div>
  );
}

function NudgesColumn({ nudges }) {
  if (!nudges || nudges.length === 0) return null;
  return (
    <aside className="w-full md:w-72 lg:w-80 sticky top-24 self-start">
      <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow-sm mb-6">
        <h3 className="font-semibold mb-3">Nudges & alerts</h3>
        <ul className="space-y-3">
          {nudges.map((n) => (
            <li key={n.id} className="flex gap-3">
              <div className="flex-none bg-indigo-50 text-indigo-600 rounded-xl w-10 h-10 flex items-center justify-center text-xl">
                {n.icon}
              </div>
              <div className="text-sm">
                <div className="font-medium">{n.title}</div>
                <div className="text-gray-500">{n.detail}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function EventsList({ events }) {
  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold mb-3">Events & crowd alerts</h3>
      <div className="space-y-4">
        {events.map((e) => (
          <div key={e.id} className="p-3 border rounded-md bg-white">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{e.title}</div>
              <div className="text-xs px-2 py-1 border rounded-md">{e.severity?.toUpperCase()}</div>
            </div>
            <div className="text-sm text-gray-600 mt-1">{e.location} · {e.date}</div>
            <div className="mt-2 text-gray-700">{e.impact}</div>
            <div className="mt-2 text-sm text-indigo-600 font-medium">Panchi: {e.impact.includes("hotels") ? "Book early & avoid beachfront stays if crowds matter." : "Check local advisories."}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendCalendar({ trend }) {
  if (!trend) return null;
  return (
    <div className="rounded-xl bg-white/70 backdrop-blur p-4 shadow-sm">
      <h4 className="font-semibold mb-2">7-day quick view</h4>
      <div className="flex gap-2 overflow-auto">
        {trend.map((d) => (
          <div key={d.date} className="min-w-[84px] p-3 text-center border rounded-md bg-white">
            <div className="text-xs text-gray-500">{d.date.slice(5)}</div>
            <div className="font-semibold mt-1">PI {d.priceIndex}</div>
            <div className="text-xs text-gray-400">W{d.weatherScore}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendingCards({ items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((it) => (
        <div key={it.id} className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase text-gray-500">{it.tag}</div>
              <div className="font-semibold text-lg">{it.title}</div>
              <div className="text-sm text-gray-600 mt-1">{it.subtitle}</div>
            </div>
            <div className="text-right">
              <div className="text-indigo-600 font-semibold">{it.priceRange}</div>
            </div>
          </div>
          <div className="mt-3">
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-400 text-white text-sm">Explore</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TransportTab({ flights, trains, cabs, active }) {
  if (active === "flights") {
    return (
      <div className="space-y-4">
        {flights.map((f) => (
          <div key={f.id} className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
            <div>
              <div className="font-medium">{f.carrier}</div>
              <div className="text-sm text-gray-500">{f.depart} → {f.arrive} · {f.duration}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">₹{f.price}</div>
              <div className="text-xs text-gray-500">per person</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (active === "trains") {
    return (
      <div className="space-y-4">
        {trains.map((t) => (
          <div key={t.id} className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
            <div>
              <div className="font-medium">{t.name} · {t.no}</div>
              <div className="text-sm text-gray-500">{t.depart} → {t.arrive} · {t.duration}</div>
              <div className="text-sm text-gray-500">Class: {t.class}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">₹{t.price}</div>
              <div className="text-xs text-gray-500">seat fare</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  // cabs
  return (
    <div className="space-y-4">
      {cabs.map((c) => (
        <div key={c.id} className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
          <div>
            <div className="font-medium">{c.provider}</div>
            <div className="text-sm text-gray-500">ETA: {c.eta} · Rating: {c.rating}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">₹{c.price}</div>
            <div className="text-xs text-gray-500">approx</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------
   Main Page Component
   --------------------------- */

export default function PlanPage() {
  const router = useRouter();
  const { destination: destQuery } = router.query;
  const dest = (typeof destQuery === "string" && destQuery) || "Goa";
  const [userName] = useState("Ethen");
  const nudges = useMemo(() => mockNudges(), []);
  const events = useMemo(() => mockEvents(dest), [dest]);
  const trending = useMemo(() => mockTrending(), []);
  const flights = useMemo(() => mockFlights(dest), [dest]);
  const trains = useMemo(() => mockTrains(dest), [dest]);
  const cabs = useMemo(() => mockCabs(dest), [dest]);
  const trend = useMemo(() => synthTrendData(dest), [dest]);
  const [activeMode, setActiveMode] = useState("flights");

  useEffect(() => {
    // If destination changes in query, you could update state or analytics here
  }, [dest]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Header dest={dest} userName={userName} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* left column (main content) */}
          <main className="lg:col-span-8 space-y-6">
            {/* Quick trend + nudges + events */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Find the best options for <span className="text-indigo-600">{dest}</span></h3>
                      <p className="text-sm text-gray-600 mt-1">Panchi synthesizes price, events, weather, and community feedback to nudge you in realtime.</p>
                    </div>
                    <div className="text-sm text-gray-500">Mode: {activeMode}</div>
                  </div>

                  <div className="mt-4">
                    <TrendCalendar trend={trend} />
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow">
                  <h4 className="font-semibold mb-2">Quick actions</h4>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => setActiveMode("flights")} className={`py-2 rounded-xl font-medium ${activeMode==="flights"?"bg-indigo-500 text-white":"bg-white border"}`}>Flights</button>
                    <button onClick={() => setActiveMode("trains")} className={`py-2 rounded-xl font-medium ${activeMode==="trains"?"bg-indigo-500 text-white":"bg-white border"}`}>Trains</button>
                    <button onClick={() => setActiveMode("cabs")} className={`py-2 rounded-xl font-medium ${activeMode==="cabs"?"bg-indigo-500 text-white":"bg-white border"}`}>Cabs</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Transport panel */}
            <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Best options — auto prioritized</h3>
                <div className="text-sm text-gray-500">Personalized for {userName}</div>
              </div>

              <div className="space-y-4">
                <TransportTab flights={flights} trains={trains} cabs={cabs} active={activeMode} />
              </div>
            </div>

            {/* Events and trending */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <EventsList events={events} />
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow">
                  <h4 className="font-semibold mb-2">Trending trips & ideas</h4>
                  <TrendingCards items={trending} />
                </div>
              </div>
            </div>
          </main>

          {/* right column (nudges + small widgets) */}
          <aside className="lg:col-span-4 space-y-6">
            <NudgesColumn nudges={nudges} />
            <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow">
              <h4 className="font-semibold mb-3">Community reviews</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="p-3 border rounded-md bg-white">
                  <div className="font-medium">Asha</div>
                  <div className="text-xs text-gray-500">Goa · 4.6</div>
                  <div className="mt-2">Loved Baga early morning. Avoid late-night crowds on Sundays.</div>
                </div>
                <div className="p-3 border rounded-md bg-white">
                  <div className="font-medium">Rajan</div>
                  <div className="text-xs text-gray-500">Manali · 4.4</div>
                  <div className="mt-2">Roads good in October, watch for landslip alerts during monsoon.</div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow">
              <h4 className="font-semibold mb-2">Safety index</h4>
              <div className="text-sm text-gray-700">Destination: <span className="font-semibold">{dest}</span></div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div style={{ width: "78%" }} className="bg-green-400 h-3" />
                </div>
                <div className="text-xs text-gray-500 mt-2">Score: 78 / 100 — Generally safe; avoid late-night beaches during festivals.</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   End of file
   --------------------------- */
