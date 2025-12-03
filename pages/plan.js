// pages/plan.js
import React from "react";
import useSWR from "swr";
import PlanCard from "./components/PlanCard";
import PriceCard from "./components/PriceCard";
import HeroBanner from "./components/HeroBanner";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function PlanPage({ query }) {
  const dest = (query && query.destination) || "Goa";
  const { data, error } = useSWR(`/api/searchFlights?q=${encodeURIComponent(dest)}`, fetcher);
  const { data: nudges } = useSWR("/api/nudges", fetcher);
  const { data: events } = useSWR("/api/events", fetcher);
  const { data: community } = useSWR("/api/community", fetcher);

  const flights = data?.results || [];

  return (
    <div style={{ padding: 24, fontFamily: "Inter, system-ui, Arial", background: "linear-gradient(180deg,#fbfdff,#fff 40%)" }}>
      <HeroBanner />
      <div style={{ height: 18 }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>
        {/* main */}
        <div>
          <h1 style={{ fontSize: 40, margin: "8px 0" }}>Where are we going next?</h1>
          <p style={{ color: "#6b7280" }}>Panchi will find the smartest and cheapest ways to reach <strong>{dest}</strong>.</p>

          <div style={{ marginTop: 18 }}>
            <PlanCard title={`Find the best options for ${dest}`} subtitle="Panchi synthesizes price, events, weather and community feedback to nudge you in realtime.">
              {/* dates / tabs (simplified) */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {["29/11","30/11","01/12","02/12","03/12","04/12","05/12"].map(d=>(
                  <div key={d} style={{ padding: "8px 12px", borderRadius: 8, background: "#fff", border: "1px solid rgba(10,20,40,0.06)"}}>{d}</div>
                ))}
              </div>

              {/* flights list */}
              <div style={{ display: "grid", gap: 12 }}>
                {error && <div style={{ color: "crimson" }}>Failed loading flights</div>}
                {!data && <div>Loading best options…</div>}
                {flights.map(f => (
                  <PriceCard key={f.id} item={f} onBook={(it)=>alert(`Book ${it.airline} placeholder`)} />
                ))}
              </div>
            </PlanCard>
          </div>
        </div>

        {/* right column */}
        <aside>
          <div style={{ borderRadius: 12, padding: 16, background: "#fff", boxShadow: "0 8px 24px rgba(20,30,50,0.04)" }}>
            <h3 style={{ marginTop: 0 }}>Nudges & alerts</h3>
            {nudges?.nudges?.map(n => (
              <div key={n.id} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700 }}>{n.title}</div>
                <div style={{ color: "#6b7280" }}>{n.text}</div>
              </div>
            ))}
            <hr style={{ border: 0, borderTop: "1px solid rgba(0,0,0,0.06)" }} />
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Community quick takes</div>
              {community?.quickTakes?.map(c => (
                <div key={c.id} style={{ marginBottom: 8 }}>
                  <strong>{c.author}</strong> — <span style={{ color: "#6b7280" }}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
