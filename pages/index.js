// pages/index.js
import Head from "next/head";
import Link from "next/link";
import Header from "./components/Header";
import HeroBird from "./components/HeroBird";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const goPlan = () => {
    const destination = encodeURIComponent(q || "Goa");
    router.push(`/plan?destination=${destination}`);
  };

  return (
    <>
      <Head>
        <title>Panchi — Smart travel</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f7f9ff] to-[#fff9fb]">
        <Header />
        <main className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* HERO */}
          <section className="relative pt-10 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <p className="text-sm text-gray-600">Hey, <span className="font-semibold">Ethen</span></p>
                <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                  Where are we going next?
                </h1>
                <p className="mt-3 text-lg text-slate-600 max-w-2xl">
                  Panchi finds the smartest, safest and cheapest ways to reach your destination — starting with flights in this MVP.
                </p>

                <div className="mt-6 flex gap-4 items-center">
                  <input
                    aria-label="Where to"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder='Try "Goa", "Manali", "Jaipur" or "beach under 5k"'
                    className="flex-1 rounded-2xl p-4 border border-gray-200 shadow-sm bg-white focus:outline-none focus:ring-4 focus:ring-purple-100"
                  />
                  <button
                    onClick={goPlan}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-pink-500 to-rose-400 text-white font-semibold shadow-lg hover:scale-[1.01] transition"
                  >
                    Let Panchi plan →
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex items-end justify-end">
                <div className="relative w-56 h-40">
                  {/* Flying bird */}
                  <HeroBird />
                </div>
              </div>
            </div>
          </section>

          {/* CONTENT */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl bg-white shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">Find the best options for Goa</h3>
                    <p className="text-sm text-gray-500 mt-1">Panchi synthesizes price, events, weather, and community feedback to nudge you in realtime.</p>
                  </div>
                  <div className="text-sm text-gray-700">Mode: <span className="font-semibold">flights</span></div>
                </div>

                {/* Dates and tabs */}
                <div className="mt-5">
                  <div className="flex flex-wrap gap-2">
                    {["29/11","30/11","01/12","02/12","03/12","04/12","05/12"].map(d=>(
                      <button key={d} className="px-4 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50">
                        {d}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-400 to-pink-400 text-white">Flights</button>
                    <button className="px-4 py-2 rounded-lg border border-gray-200">Trains</button>
                    <button className="px-4 py-2 rounded-lg border border-gray-200">Cabs</button>
                  </div>
                </div>

                {/* Sample results */}
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl p-4 bg-gray-50 flex justify-between items-center">
                    <div>
                      <div className="font-semibold">IndiAir</div>
                      <div className="text-sm text-gray-500">DEL 06:00 → Goa 08:05 · 2h 5m</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold">₹3499</div>
                      <button className="mt-3 px-3 py-1 rounded-md border border-gray-200">Book</button>
                    </div>
                  </div>

                  <div className="rounded-xl p-4 bg-gray-50 flex justify-between items-center">
                    <div>
                      <div className="font-semibold">SkyWays</div>
                      <div className="text-sm text-gray-500">DEL 09:00 → Goa 11:05 · 2h 5m</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold">₹4299</div>
                      <button className="mt-3 px-3 py-1 rounded-md border border-gray-200">Book</button>
                    </div>
                  </div>

                  <div className="rounded-xl p-4 bg-gray-50 flex justify-between items-center">
                    <div>
                      <div className="font-semibold">BudgetAir</div>
                      <div className="text-sm text-gray-500">DEL 17:15 → Goa 19:20 · 2h 5m</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold">₹2999</div>
                      <button className="mt-3 px-3 py-1 rounded-md border border-gray-200">Book</button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Events & crowd example */}
              <div className="rounded-2xl bg-white shadow-md p-6">
                <h4 className="font-semibold">Events & crowd alerts</h4>
                <div className="mt-3 space-y-4 text-sm text-gray-700">
                  <div><strong>HIGH</strong> · Sunburn-style EDM Festival · Vagator, Goa · 2025-12-28 — High crowding. Panchi: avoid beachfront stays if you want quiet.</div>
                  <div><strong>HIGH</strong> · IPL Playoffs (Sample) · Mumbai · 2026-05-20 — Local transport crowded. Panchi: book extra buffer time.</div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="space-y-6">
              <div className="rounded-2xl bg-white shadow-md p-6">
                <h5 className="font-semibold">Nudges & alerts</h5>
                <ul className="mt-4 space-y-3 text-sm text-gray-700">
                  <li>Rain alert — Baga / Calangute · Light rain Saturday evening; prefer inland stays for a quiet morning.</li>
                  <li>Price surge likely next Fri — Searches spiking for DEL → GOI. Book early to save ~10–18%.</li>
                  <li>Traffic at Delhi T3 (Evening) — Allow 30–45 mins extra.</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-white shadow-md p-6">
                <h5 className="font-semibold">Community quick takes</h5>
                <div className="mt-3 text-sm text-gray-700">
                  <div><strong>Asha</strong> — "Loved morning at Baga, crowd manageable."</div>
                  <div className="mt-2"><strong>Rajan</strong> — "Road diversions in festival season; allow extra time."</div>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </>
  );
}
