// pages/plan.js
import Head from "next/head";
import Header from "./components/Header";
import HeroBird from "./components/HeroBird";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then(r=>r.json());

export default function Plan() {
  const router = useRouter();
  const { destination = "Goa" } = router.query;

  // call our serverless API to fetch flight mock/real data
  const { data, error } = useSWR(
    () => (destination ? `/api/searchFlights?to=${destination}` : null),
    fetcher,
    { revalidateOnFocus: false }
  );

  return (
    <>
      <Head><title>Panchi · Plan</title></Head>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600">Hey, <strong>Ethen</strong></p>
            <h1 className="text-4xl font-extrabold">Where are we going next?</h1>
            <p className="mt-2 text-gray-600">Panchi will find the smartest and cheapest ways to reach <strong>{destination}</strong> — starting with flights in this MVP.</p>
          </div>

          <div className="hidden md:block w-48 h-32">
            <HeroBird />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white shadow p-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Find the best options for {destination}</h3>
                  <p className="text-sm text-gray-500">Panchi synthesizes price, events, weather and community feedback to nudge you in realtime.</p>
                </div>
                <div className="text-sm text-gray-600">Mode: <strong>flights</strong></div>
              </div>

              <div className="mt-4">
                <div className="flex gap-3 flex-wrap">
                  {["29/11","30/11","01/12","02/12","03/12","04/12","05/12"].map(d=>(
                    <button key={d} className="px-3 py-2 rounded-md border border-gray-200">{d}</button>
                  ))}
                </div>
                <div className="mt-4 space-y-4">
                  {error && <div className="text-red-500">Failed to load.</div>}
                  {!data && !error && <div className="text-gray-500">Loading options...</div>}
                  {data?.flights?.length === 0 && <div className="text-gray-500">No flights found for selected date.</div>}
                  {data?.flights?.map(f => (
                    <div key={f.id} className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{f.airline}</div>
                        <div className="text-sm text-gray-500">{f.depart} → {f.arrive} · {f.duration}</div>
                        <div className="text-xs text-gray-400 mt-1">Mood: {f.nudge}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-xl">₹{f.price}</div>
                        <button className="mt-2 px-3 py-1 rounded-md border">Book</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white shadow p-6">
              <h4 className="font-semibold">Events & crowd alerts</h4>
              <div className="mt-3 text-sm text-gray-700">
                <div><strong>HIGH</strong> — Sunburn-esque EDM Festival — Vagator, Goa — 2025-12-28. Panchi: avoid beachfront stays if you want quiet.</div>
                <div className="mt-3"><strong>MEDIUM</strong> — Classical Music Fest — Thiruvananthapuram — 2025-11-09.</div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-white shadow p-6">
              <h5 className="font-semibold">Nudges & alerts</h5>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <div>Rain alert in Goa this weekend — prefer indoor activities Sunday morning.</div>
                <div>High traffic near Delhi airport (T3) — allow 30–45 mins extra.</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white shadow p-6">
              <h5 className="font-semibold">Community quick takes</h5>
              <div className="mt-3 text-sm text-gray-700">
                <div><strong>Asha</strong> — "Crowd was manageable in Baga early morning." </div>
                <div className="mt-2"><strong>Rajan</strong> — "Road diversions near festival; expect delays."</div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
