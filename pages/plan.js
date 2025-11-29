// pages/plan.js
import { useEffect, useState, useRef } from "react";

/*
  Panchi - Planner (full replacement)
  - Updated layout rules to avoid grid overflow / alignment issues
  - Sticky left nudges column
  - Responsive trending grid with auto-fit
  - Event card max-height + internal scroll
  - All previous planner logic kept
*/

export default function PlanPage() {
  const [destination, setDestination] = useState("Goa");
  const [loading, setLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(false);
  const [error, setError] = useState("");

  // context
  const [nudges, setNudges] = useState([]);
  const [events, setEvents] = useState([]);
  const [hotPlaces, setHotPlaces] = useState([]);
  const [reviews, setReviews] = useState([]);

  // transports / timeline / verdict
  const [flight, setFlight] = useState(null);
  const [train, setTrain] = useState(null);
  const [bus, setBus] = useState(null);
  const [cab, setCab] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [ranked, setRanked] = useState([]);
  const [savedAlerts, setSavedAlerts] = useState([]);

  // refs
  const nudgesRef = useRef(null);
  const eventsRef = useRef(null);
  const hotRef = useRef(null);
  const reviewsRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search);
      const dest = q.get("destination") || q.get("q") || "Goa";
      setDestination(dest);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const s = window.localStorage.getItem("panchiAlerts");
        setSavedAlerts(s ? JSON.parse(s) : []);
      } catch {
        setSavedAlerts([]);
      }
    }
  }, []);

  useEffect(() => {
    if (destination) runPlanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination]);

  async function runPlanner() {
    setLoading(true);
    setContextLoading(true);
    setError("");
    setVerdict(null);
    setRanked([]);
    try {
      // try fetching mock APIs; fallback to an internal mock if unavailable
      const [
        nudgesRes,
        eventsRes,
        hotRes,
        reviewsRes,
        flightsRes,
        trainsRes,
        busesRes,
        cabsRes,
        trendRes,
      ] = await Promise.allSettled([
        fetch("/api/mockNudges"),
        fetch("/api/mockEvents"),
        fetch("/api/mockHotPlaces"),
        fetch("/api/mockCommunity"),
        fetch("/api/mockFlights"),
        fetch("/api/mockTrains"),
        fetch("/api/mockBuses"),
        fetch("/api/mockCabs"),
        fetch("/api/mockPriceTrends"),
      ]);

      const nudgesData = nudgesRes.status === "fulfilled" && nudgesRes.value.ok ? await nudgesRes.value.json() : simpleMockNudges();
      const eventsData = eventsRes.status === "fulfilled" && eventsRes.value.ok ? await eventsRes.value.json() : simpleMockEvents();
      const hotData = hotRes.status === "fulfilled" && hotRes.value.ok ? await hotRes.value.json() : simpleMockHotPlaces();
      const reviewsData = reviewsRes.status === "fulfilled" && reviewsRes.value.ok ? await reviewsRes.value.json() : simpleMockReviews();

      const flightsData = flightsRes.status === "fulfilled" && flightsRes.value.ok ? await flightsRes.value.json() : simpleMockFlights(destination);
      const trainsData = trainsRes.status === "fulfilled" && trainsRes.value.ok ? await trainsRes.value.json() : simpleMockTrains(destination);
      const busesData = busesRes.status === "fulfilled" && busesRes.value.ok ? await busesRes.value.json() : simpleMockBuses(destination);
      const cabsData = cabsRes.status === "fulfilled" && cabsRes.value.ok ? await cabsRes.value.json() : simpleMockCabs(destination);

      let trendData = [];
      if (trendRes.status === "fulfilled" && trendRes.value.ok) {
        trendData = await trendRes.value.json();
      } else {
        trendData = synthesizeTrend(destination, eventsData, nudgesData);
      }

      setNudges(nudgesData || []);
      setEvents(eventsData || []);
      setHotPlaces(hotData || []);
      setReviews(reviewsData || []);

      setFlight((flightsData && flightsData[0]) || null);
      setTrain((trainsData && trainsData[0]) || null);
      setBus((busesData && busesData[0]) || null);
      setCab((cabsData && cabsData[0]) || null);

      const timelineWithScores = computeTimelineScores(trendData, eventsData, nudgesData);
      setTimeline(timelineWithScores);
      setSelectedDay(timelineWithScores[0] || null);

      setContextLoading(false);

      const insight = buildVerdict({
        destination,
        nudges: nudgesData,
        events: eventsData,
        hotPlaces: hotData,
        reviews: reviewsData,
        timeline: timelineWithScores,
      });
      setVerdict(insight);

      const rankedOptions = scoreOptions({
        destination,
        flight: (flightsData && flightsData[0]) || null,
        train: (trainsData && trainsData[0]) || null,
        bus: (busesData && busesData[0]) || null,
        cab: (cabsData && cabsData[0]) || null,
        context: insight,
        timelineDay: timelineWithScores[0] || null,
      });
      setRanked(rankedOptions);
    } catch (err) {
      console.error(err);
      setError("Planner failed. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }

  function handleJump(targetId) {
    const map = {
      nudges: nudgesRef.current,
      events: eventsRef.current,
      hot: hotRef.current,
      reviews: reviewsRef.current,
      timeline: timelineRef.current,
    };
    const el = map[targetId];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.add("panchi-highlight");
    setTimeout(() => el.classList.remove("panchi-highlight"), 2200);
  }

  function saveAlert() {
    try {
      const alerts = (typeof window !== "undefined" && JSON.parse(window.localStorage.getItem("panchiAlerts") || "[]")) || [];
      alerts.unshift({ destination, when: new Date().toISOString(), verdict });
      if (typeof window !== "undefined") window.localStorage.setItem("panchiAlerts", JSON.stringify(alerts));
      setSavedAlerts(alerts);
      toast("Saved alert — Panchi will watch this destination.");
    } catch (e) {
      console.error(e);
      toast("Could not save alert.");
    }
  }

  function toast(msg) {
    if (typeof window !== "undefined") alert(msg);
  }

  function synthesizeTrend(dest, eventsList = [], nudgesList = []) {
    const res = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      let priceIndex = 0.45 + Math.random() * 0.4;
      const dayStr = d.toISOString().slice(0, 10);
      const eventRisk = eventsList.some((ev) => ev.location && ev.location.toLowerCase().includes(dest.toLowerCase()) && ev.date === dayStr) ? 0.8 : 0;
      const pricingNudge = nudgesList.some((n) => n.type === "pricing") ? 0.12 : 0;
      priceIndex = Math.min(0.98, priceIndex + eventRisk * 0.25 + pricingNudge);
      const weatherRisk = nudgesList.some((n) => n.type === "weather") ? 0.4 : Math.random() * 0.25;
      const evRisk = eventRisk || (Math.random() > 0.85 ? 0.4 : 0);
      res.push({
        date: d.toISOString().slice(0, 10),
        priceIndex: Math.round(priceIndex * 100) / 100,
        weatherRisk: Math.round(weatherRisk * 100) / 100,
        eventRisk: Math.round(evRisk * 100) / 100,
      });
    }
    return res;
  }

  function computeTimelineScores(trendData, eventsList, nudgesList) {
    if (!trendData || trendData.length === 0) return [];
    const out = trendData.map((d) => {
      const p = typeof d.priceIndex === "number" ? d.priceIndex : 0.6;
      const w = typeof d.weatherRisk === "number" ? d.weatherRisk : 0.15;
      const e = typeof d.eventRisk === "number" ? d.eventRisk : 0;
      const raw = (1 - p) * 0.5 + (1 - w) * 0.3 + (1 - e) * 0.2;
      return { ...d, score: Math.round(raw * 100) / 100 };
    });
    return out;
  }

  function buildVerdict({ destination, nudges, events, hotPlaces, reviews, timeline }) {
    const dest = destination.toLowerCase();
    let score = 60;
    const bullets = [];

    const hot = hotPlaces.find((h) => h.title && h.title.toLowerCase() === dest);
    if (hot) {
      bullets.push(`${hot.title} trending — ${hot.reason || hot.subtitle} (budget ${hot.budget || "varies"}).`);
      score += 8;
      bullets.push("Trending implies higher demand; consider weekday or early booking.");
      score -= 4;
    }

    const relevantNudges = (nudges || []).filter((n) => {
      return (
        (n.title && n.title.toLowerCase().includes(dest)) ||
        (n.detail && n.detail.toLowerCase().includes(dest)) ||
        ["weather", "pricing", "traffic", "event"].includes(n.type)
      );
    });

    relevantNudges.forEach((n) => {
      if (n.type === "weather") {
        bullets.push(`Weather: ${n.title} — ${n.detail}`);
        score -= 14;
      } else if (n.type === "pricing") {
        bullets.push(`Price alert: ${n.title} — ${n.impact || n.detail}`);
        score -= 10;
      } else if (n.type === "traffic") {
        bullets.push(`Traffic advisory: ${n.title} — ${n.impact || n.detail}`);
        score -= 6;
      } else if (n.type === "event") {
        bullets.push(`Event notice: ${n.title} — ${n.detail}`);
        score -= 8;
      }
    });

    const relevantEvents = (events || []).filter((ev) => ev.location && ev.location.toLowerCase().includes(dest));
    relevantEvents.forEach((ev) => {
      bullets.push(`Event: ${ev.title} on ${ev.date} — ${ev.impact || ""}`);
      if (ev.severity === "high") score -= 18;
      else if (ev.severity === "medium") score -= 9;
      else score -= 4;
    });

    const relevantReviews = (reviews || []).filter((r) => r.location && r.location.toLowerCase().includes(dest));
    if (relevantReviews.length > 0) {
      const avg = Math.round((relevantReviews.reduce((s, r) => s + (r.rating || 4.5), 0) / relevantReviews.length) * 10) / 10;
      bullets.push(`Community: ${relevantReviews.length} recent notes — average rating ${avg} ⭐`);
      score += (avg - 4.0) * 4;
    }

    if (timeline && timeline.length > 0) {
      const best = timeline.reduce((acc, d) => (d.score > (acc.score || -1) ? d : acc), {});
      const worst = timeline.reduce((acc, d) => (d.score < (acc.score || 999) ? d : acc), {});
      bullets.push(`Best upcoming day: ${formatDate(best.date)} (score ${Math.round(best.score * 100) / 100})`);
      bullets.push(`Avoid day: ${formatDate(worst.date)} if possible.`);
      if (best.score < 0.45) score -= 6;
      else score += 6;
    }

    if (score > 95) score = 95;
    if (score < 5) score = 5;

    let label = "Okay to visit";
    if (score >= 70) label = "Good to go";
    else if (score >= 45) label = "Plan with caution";
    else label = "Not recommended right now";

    const summary = `${label} — ${Math.round(score)} / 100`;
    return {
      score: Math.round(score),
      label,
      summary,
      bullets,
      relevantNudges,
      relevantEvents,
      hotPlace: hot || null,
      sampleReviews: relevantReviews.slice(0, 3),
    };
  }

  function formatDate(d) {
    if (!d) return "";
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }

  function scoreOptions({ destination, flight, train, bus, cab, context, timelineDay }) {
    const opts = [];
    if (flight) opts.push({ key: "flight", label: "Flight", data: flight });
    if (train) opts.push({ key: "train", label: "Train", data: train });
    if (bus) opts.push({ key: "bus", label: "Bus", data: bus });
    if (cab) opts.push({ key: "cab", label: "Cab", data: cab });

    const priced = opts.map((o) => {
      const price = o.data && typeof o.data.price === "number" ? o.data.price : 999999;
      const durationMin = parseDuration(o.data && o.data.duration ? o.data.duration : "");
      return { ...o, price, durationMin };
    });

    if (priced.length === 0) return [];

    const minPrice = Math.min(...priced.map((p) => p.price));
    const maxPrice = Math.max(...priced.map((p) => p.price));
    const minDur = Math.min(...priced.map((p) => p.durationMin));
    const maxDur = Math.max(...priced.map((p) => p.durationMin));

    const eventPenalties = {};
    priced.forEach((p) => (eventPenalties[p.key] = 0));

    (context.relevantEvents || []).forEach((ev) => {
      const severityWeight = ev.severity === "high" ? 1 : ev.severity === "medium" ? 0.6 : 0.25;
      if (eventPenalties.cab !== undefined) eventPenalties.cab += 30 * severityWeight;
      if (eventPenalties.bus !== undefined) eventPenalties.bus += 12 * severityWeight;
      if (eventPenalties.flight !== undefined) eventPenalties.flight += 10 * severityWeight;
      if (eventPenalties.train !== undefined) eventPenalties.train += 4 * severityWeight;
    });

    (context.relevantNudges || []).forEach((n) => {
      if (n.type === "pricing") {
        if (eventPenalties.flight !== undefined) eventPenalties.flight += 12;
      }
      if (n.type === "traffic") {
        if (eventPenalties.cab !== undefined) eventPenalties.cab += 14;
      }
      if (n.type === "weather") {
        if (eventPenalties.bus !== undefined) eventPenalties.bus += 10;
        if (eventPenalties.cab !== undefined) eventPenalties.cab += 8;
      }
    });

    const weatherRisk = deriveWeatherRisk(context.relevantNudges || [], context.relevantEvents || []);
    const communityPenalty = deriveCommunityPenalty(context.sampleReviews || [], context);

    const timelinePenaltyFactor = timelineDay ? Math.max(0, (0.6 - timelineDay.score)) * 30 : 0;

    const results = priced.map((p) => {
      const priceComp = normalize(p.price, minPrice, maxPrice); // 0..1
      const durComp = normalize(p.durationMin, minDur, maxDur);
      const priceScore = priceComp * 100;
      const durScore = durComp * 100;

      const eventPenalty = eventPenalties[p.key] || 0;
      const weatherPenalty = (weatherRisk || 0) * 40;
      const communityComp = communityPenalty;
      const trendPenalty = timelinePenaltyFactor * (p.key === "flight" ? 0.9 : p.key === "cab" ? 0.8 : 0.6);

      const combinedPenalty = eventPenalty + weatherPenalty + communityComp + trendPenalty;

      const final =
        priceScore * 0.45 +
        durScore * 0.2 +
        combinedPenalty * 0.35;

      return {
        ...p,
        priceScore,
        durScore,
        eventPenalty,
        weatherPenalty,
        communityComp,
        trendPenalty,
        finalScore: Math.round(final * 100) / 100,
      };
    });

    results.sort((a, b) => a.finalScore - b.finalScore);
    return results;
  }

  function parseDuration(str) {
    if (!str) return 24 * 60;
    const h = (str.match(/(\d+)\s*h/) || [])[1];
    const m = (str.match(/(\d+)\s*m/) || [])[1];
    let total = 0;
    if (h) total += parseInt(h, 10) * 60;
    if (m) total += parseInt(m, 10);
    if (total === 0) {
      const onlyMin = (str.match(/(\d+)\s*min/) || [])[1];
      if (onlyMin) total = parseInt(onlyMin, 10);
    }
    if (total === 0) total = 24 * 60;
    return total;
  }

  function normalize(val, mn, mx) {
    if (mx === mn) return 0;
    return (val - mn) / (mx - mn);
  }

  function deriveWeatherRisk(nudgesArr, eventsArr) {
    if ((nudgesArr || []).some((n) => n.type === "weather")) return 0.6;
    if ((eventsArr || []).some((e) => e.severity === "high")) return 0.35;
    return 0.12;
  }

  function deriveCommunityPenalty(sampleReviews, context) {
    if (!sampleReviews || sampleReviews.length === 0) return 8;
    const avg = sampleReviews.reduce((s, r) => s + (r.rating || 4.5), 0) / sampleReviews.length;
    return Math.max(0, (5 - avg) * 6);
  }

  return (
    <>
      <style>{pageCss}</style>
      <main className="page">
        <div className="container">
          <header className="header">
            <div className="left">
              <a className="back" href="/">◀</a>
              <img src="/panchi-logo.png" alt="Panchi" className="logo" />
              <div className="subtitle">AI Planner · Context-first</div>
            </div>

            <div className="right">
              <a className="link" href="/waitlist">Join waitlist</a>
              <button className="btn" onClick={runPlanner}>Refresh</button>
            </div>
          </header>

          <h1 className="title">Panchi Planner — {destination}</h1>
          <p className="desc">Panchi scans weather, events, prices & community to tell you if it’s a good time to go — then recommends the best mode.</p>

          {contextLoading && <div className="mutedBox">Loading context & signals…</div>}
          {error && <div className="errorBox">{error}</div>}

          {verdict && (
            <section className="verdict">
              <div className="verdictLeft">
                <div className="verdictHeadline">
                  <div className="tag">Panchi verdict</div>
                  <div className="score">{verdict.score}/100</div>
                </div>
                <div className="verdictTitle">{verdict.label}</div>
                <div className="verdictSummary">{verdict.summary}</div>
              </div>

              <div className="verdictRight">
                <button className="saveBtn" onClick={saveAlert}>Save alert</button>
              </div>

              <div className="verdictBullets">
                {verdict.bullets.map((b, i) => {
                  const lower = b.toLowerCase();
                  let target = "nudges";
                  if (lower.includes("event") || lower.includes("festival") || lower.includes("visarjan")) target = "events";
                  else if (lower.includes("weather") || lower.includes("rain")) target = "nudges";
                  else if (lower.includes("best upcoming day") || lower.includes("avoid day")) target = "timeline";
                  else if (lower.includes("community")) target = "reviews";
                  return (
                    <button key={i} className="bullet" onClick={() => handleJump(target)}>• {b}</button>
                  );
                })}
              </div>
            </section>
          )}

          <section className="timelineSection">
            <div className="sectionHeader">
              <h3>📅 Best days to travel (7-day view)</h3>
              <div className="tiny">Click a day to bias recommendations</div>
            </div>

            <div className="timelineRow" ref={timelineRef}>
              {timeline && timeline.length > 0 ? (
                timeline.map((d) => {
                  const color = d.score >= 0.75 ? "good" : d.score >= 0.5 ? "ok" : "bad";
                  return (
                    <div
                      key={d.date}
                      className={`dayPill ${color} ${selectedDay && selectedDay.date === d.date ? "active" : ""}`}
                      onClick={() => {
                        setSelectedDay(d);
                        const newRanked = scoreOptions({
                          destination,
                          flight,
                          train,
                          bus,
                          cab,
                          context: verdict,
                          timelineDay: d,
                        });
                        setRanked(newRanked);
                        setTimeout(() => {
                          const el = document.getElementById("results-section");
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 300);
                      }}
                    >
                      <div className="dayLabel">{new Date(d.date).toLocaleDateString(undefined, { weekday: "short" })}</div>
                      <div className="dayDate">{new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
                      <div className="dayEmoji">{d.weatherRisk > 0.6 ? "🌧️" : d.eventRisk > 0.4 ? "🎉" : "☀️"}</div>
                      <div className="dayScore">{Math.round(d.score * 100)}</div>
                    </div>
                  );
                })
              ) : (
                <div className="mutedBox">Timeline unavailable</div>
              )}
            </div>
          </section>

          <section className="signals">
            <div className="grid">
              <div ref={nudgesRef} id="nudges-section" className="card nudgesSidebar">
                <h4>Nudges & alerts</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(nudges || []).slice(0, 10).map((n) => (
                    <div key={n.id || n.title} className="nudgeRow">
                      <div className="nudgeIcon">{n.icon || (n.type === "weather" ? "☔" : n.type === "pricing" ? "🔥" : "⚠️")}</div>
                      <div className="nudgeContent">
                        <div className="nudgeTitle">{n.title}</div>
                        <div className="nudgeDetail">{n.detail}</div>
                      </div>
                    </div>
                  ))}
                  {(nudges || []).length === 0 && <div className="mutedBox">No nudges</div>}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div ref={eventsRef} id="events-section" className="card eventsCard">
                  <h4>Events & crowd alerts</h4>
                  {(events || []).length === 0 && <div className="mutedBox">No events</div>}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {(events || []).map((ev) => (
                      <div className="event" key={ev.id || ev.title}>
                        <div className={`severity ${ev.severity || "low"}`}>{(ev.severity || "low").toUpperCase()}</div>
                        <div className="eventBody">
                          <div className="eventTitle">{ev.title}</div>
                          <div className="eventMeta">{ev.location} · {ev.date}</div>
                          <div className="eventImpact">{ev.impact}</div>
                          <div className="eventAction">Panchi: {ev.recommendedAction || "Check local advisories."}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div ref={hotRef} id="hot-section" className="card hotSection">
                  <h4>Trending trips & ideas</h4>

                  {(hotPlaces || []).length === 0 && <div className="mutedBox">No trending data</div>}

                  <div className="trendingGrid">
                    {(hotPlaces || []).slice(0, 6).map((h) => (
                      <article key={h.id || h.title} className="trendCard">
                        <div
                          className="trendImage"
                          style={{ backgroundImage: `url(${h.image || "/placeholder-trip.jpg"})` }}
                        >
                          <div className="trendBadge">{h.tag || "Popular"}</div>
                        </div>
                        <div className="trendBody">
                          <div>
                            <div className="trendTitle">{h.title}</div>
                            <div className="trendMeta">{h.subtitle || h.reason || ""}</div>
                          </div>
                          <div className="trendFooter">
                            <div className="trendBudget">₹{h.budget || "Varies"}</div>
                            <button
                              className="trendBtn"
                              onClick={() => {
                                setDestination(h.title);
                                if (typeof window !== "undefined") {
                                  const url = new URL(window.location.href);
                                  url.searchParams.set("destination", h.title);
                                  window.history.pushState({}, "", url.toString());
                                }
                                setTimeout(runPlanner, 80);
                              }}
                            >
                              Explore
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div ref={reviewsRef} id="reviews-section" className="card">
                  <h4>Community notes</h4>
                  {(reviews || []).length === 0 && <div className="mutedBox">No community reviews</div>}
                  <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
                    {(reviews || []).slice(0, 8).map((r) => (
                      <div className="review" key={r.id || r.name}>
                        <div className="revHeader">{r.name} · {r.rating} ⭐</div>
                        <div className="revLoc">{r.location || ""} {r.emoji || ""}</div>
                        <div className="revText">{r.review}</div>
                        <div className="revTip">Tip: {r.tip}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="results-section" className="results">
            <h3>Recommended options</h3>
            {loading && <div className="mutedBox">Scoring options...</div>}
            {!loading && ranked.length === 0 && <div className="mutedBox">No travel options available</div>}
            <div style={{ display: "grid", gap: 12 }}>
              {ranked.map((r, i) => (
                <div key={r.key} className={`resultCard ${i === 0 ? "recommended" : ""}`}>
                  <div className="left">
                    <div className="mode">{humanModeEmoji(r.key)} {r.label}</div>
                    <div className="meta">{r.data?.depart || ""} → {r.data?.arrive || ""} · {r.data?.duration || `${r.durationMin} min`}</div>
                  </div>

                  <div className="right">
                    <div className="price">₹{r.price}</div>
                    <div className="scoreBreakdown">Score: {Math.round(r.finalScore)}</div>
                    <div className="btnRow">
                      <button className="viewBtn" onClick={() => alert(`mock: view ${r.label}`)}>{i === 0 ? "Recommended" : "View"}</button>
                    </div>
                    <div className="explain">
                      <small>penalty: {Math.round(r.eventPenalty || 0)} · weather: {Math.round(r.weatherPenalty || 0)} · comm: {Math.round(r.communityComp || 0)}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="alerts">
            <h4>Saved alerts</h4>
            {savedAlerts && savedAlerts.length === 0 && <div className="mutedBox">No saved alerts</div>}
            {savedAlerts && savedAlerts.length > 0 && (
              <div style={{ display: "grid", gap: 8 }}>
                {savedAlerts.map((a, idx) => (
                  <div key={idx} className="alertCard">{a.destination} · saved {new Date(a.when).toLocaleString()} · {a.verdict?.summary || ""}</div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

/* ------------------------
   CSS (full updated)
   - key changes:
     grid-template-columns: 280px minmax(0, 1fr)
     eventsCard max-height + overflow
     trendingGrid auto-fit
     nudges sticky
------------------------ */
const pageCss = `
:root{
  --card-bg: rgba(255,255,255,0.98);
}
*{box-sizing:border-box;font-family:Inter, Poppins, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;}
body,html,#__next{margin:0;padding:0;background:linear-gradient(180deg, rgba(14,165,233,0.02), rgba(255,255,255,0.02));}
.page{padding:28px 12px 80px;}
.container{max-width:1300px;margin:0 auto;background:var(--card-bg);border-radius:18px;padding:18px;box-shadow:0 20px 60px rgba(16,24,40,0.08);}

/* header */
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;gap:12px}
.header .left{display:flex;align-items:center;gap:12px}
.back{font-size:20px;color:#0f1724;text-decoration:none}
.logo{height:56px}
.subtitle{font-size:13px;color:rgba(15,23,36,0.6)}
.header .right{display:flex;gap:10px;align-items:center}
.link{color:#7c3aed;text-decoration:none;font-weight:600}
.btn{background:linear-gradient(90deg,#7c3aed,#ff7a59);color:white;border:none;padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700}

/* titles */
.title{font-size:22px;margin:6px 0 6px}
.desc{color:rgba(15,23,36,0.7);margin-bottom:10px}

/* muted / error */
.mutedBox{padding:10px;border-radius:12px;background:linear-gradient(90deg, rgba(2,6,23,0.03), rgba(2,6,23,0.02));color:rgba(2,6,23,0.6)}
.errorBox{padding:10px;border-radius:12px;background:#FFF4F4;color:#B00020}

/* verdict */
.verdict{display:flex;flex-direction:column;gap:12px;padding:14px;border-radius:14px;background:linear-gradient(90deg,#0ea5e9 0%, #7c3aed 50%, #ff7a59 100%);color:white;margin-bottom:18px}
.verdictHeadline{display:flex;justify-content:space-between;align-items:center;gap:10px}
.tag{font-size:12px;opacity:0.95;text-transform:uppercase}
.score{font-size:20px;font-weight:800}
.verdictTitle{font-size:18px;font-weight:800;margin-top:4px}
.verdictSummary{opacity:0.95}
.saveBtn{background:rgba(255,255,255,0.12);border:none;color:white;padding:10px 12px;border-radius:12px;cursor:pointer}
.verdictBullets{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.bullet{background:transparent;border:none;color:white;text-align:left;padding:6px 0;cursor:pointer;font-size:13px}

/* timeline */
.timelineSection{margin-bottom:16px}
.sectionHeader{display:flex;justify-content:space-between;align-items:center}
.timelineRow{display:flex;gap:10px;overflow:auto;padding:12px 0}
.dayPill{min-width:110px;border-radius:12px;padding:10px;background:linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.92));box-shadow:0 8px 20px rgba(16,24,40,0.06);cursor:pointer;display:flex;flex-direction:column;gap:4px;align-items:center}
.dayPill.good{border:2px solid #10b981}
.dayPill.ok{border:2px solid #f59e0b}
.dayPill.bad{border:2px solid #ef4444}
.dayPill.active{transform:translateY(-6px);box-shadow:0 20px 40px rgba(2,6,23,0.12)}
.dayLabel{font-size:13px;font-weight:700}
.dayDate{font-size:12px;color:rgba(2,6,23,0.6)}
.dayEmoji{font-size:18px}
.dayScore{font-weight:800;margin-top:6px}

/* signals & trending layout - updated for trending card design */
.signals { margin-bottom:18px; }

/* Desktop: left narrow column + right content flow.
   Use minmax(0, 1fr) to allow children to shrink correctly and avoid overflow.
*/
.grid {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

/* Generic card */
.card {
  padding: 14px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 12px 30px rgba(2,6,23,0.04);
}

/* MAKE LEFT SIDEBAR sticky + scrollable */
.nudgesSidebar {
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 120px);
  overflow:auto;
  padding-right:6px;
}

/* events card: set a max height so it won't push the layout; make it scroll internally */
.eventsCard {
  max-height: 520px;
  overflow: auto;
}

/* Trending grid uses auto-fit to make columns responsive */
.trendingGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  align-items: stretch;
}

/* single trending card */
.trendCard {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(180deg, #fff, #fcfcff);
  box-shadow: 0 12px 28px rgba(2,6,23,0.06);
  min-height: 140px;
}

/* image area */
.trendImage {
  height: 110px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.trendBadge {
  position: absolute;
  left: 12px;
  top: 12px;
  background: rgba(0,0,0,0.55);
  color: white;
  font-weight:700;
  padding: 6px 8px;
  border-radius: 999px;
  font-size: 12px;
}

/* body */
.trendBody {
  padding: 10px 12px 14px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  gap:8px;
}

.trendTitle {
  font-weight:800;
  font-size:15px;
  color:#0f1724;
}

.trendMeta {
  font-size:13px;
  color:rgba(2,6,23,0.6);
}

.trendFooter {
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
}

.trendBudget {
  font-weight:800;
  color:#0f1724;
}

.trendBtn {
  padding:8px 10px;
  border-radius:999px;
  border:none;
  background:linear-gradient(90deg,#7c3aed,#ff7a59);
  color:white;
  font-weight:700;
  cursor:pointer;
}

/* review horizontal cards */
.review { min-width:220px; border-radius:10px; padding:10px; background:linear-gradient(180deg,#fff,#fbfaff); box-shadow:0 6px 18px rgba(2,6,23,0.04); }

/* results */
.results{margin-bottom:18px}
.resultCard{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px;border-radius:12px;background:white;box-shadow:0 10px 30px rgba(2,6,23,0.04)}
.resultCard.recommended{background:linear-gradient(90deg,#10b981,#0ea5e9);color:white}
.left{display:flex;flex-direction:column}
.mode{font-weight:800}
.meta{font-size:13px;opacity:0.9}
.right{text-align:right}
.price{font-weight:900;font-size:18px}
.scoreBreakdown{font-size:13px;color:rgba(2,6,23,0.6)}
.btnRow{margin-top:8px}
.viewBtn{background:linear-gradient(90deg,#7c3aed,#ff7a59);color:white;border:none;padding:8px 12px;border-radius:999px;cursor:pointer}
.explain{margin-top:6px;font-size:11px;opacity:0.85}

/* alerts */
.alerts{margin-top:18px}
.alertCard{padding:10px;border-radius:10px;background:linear-gradient(90deg,#fff,#fafafa)}

/* small structures */
.nudgeRow{display:flex;gap:8px;align-items:flex-start;margin-bottom:6px}
.nudgeIcon{width:36px;height:36px;border-radius:10px;background:linear-gradient(90deg,#eef2ff,#fff);display:flex;align-items:center;justify-content:center;font-size:18px}
.nudgeContent{flex:1}
.nudgeTitle{font-weight:700}
.nudgeDetail{font-size:13px;color:rgba(2,6,23,0.65)}

/* highlight */
.panchi-highlight{box-shadow:0 24px 60px rgba(124,58,237,0.12);transform:translateY(-6px);transition:all 0.28s ease}

/* responsive */
@media(max-width:980px){
  .container{padding:14px}
  .grid{grid-template-columns:1fr}
  .nudgesSidebar{position:relative;top:auto;max-height:none}
  .eventsCard{max-height:none;overflow:visible}
  .trendingGrid{grid-template-columns:repeat(1,1fr)}
}
`;

/* ------------------------
   Internal fallback mocks (same as earlier)
------------------------ */
function simpleMockNudges() {
  return [
    { id: "n1", type: "weather", title: "Rain alert in Goa this weekend", detail: "Light rain expected on Saturday evening around Baga-Calangute stretch.", icon: "☔" },
    { id: "n2", type: "pricing", title: "Flight surge likely for Goa next Friday", detail: "Searches spike for DEL → GOI, book early to save.", icon: "🔥" },
    { id: "n3", type: "traffic", title: "High traffic near Delhi airport (T3) during evening peak", detail: "Construction + office traffic between 5 PM–8 PM on NH-48 towards IGI.", icon: "🚦" },
  ];
}
function simpleMockEvents() {
  const dt = new Date();
  const later = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 12);
  const laterStr = later.toISOString().slice(0, 10);
  return [
    { id: "e1", title: "Sunburn-esque EDM Festival", location: "Vagator, Goa", date: laterStr, severity: "high", impact: "High crowding - Hotels +30% - Cab surge likely", recommendedAction: "Book hotels + cabs now if attending; avoid beachfront stays if you want quiet." },
    { id: "e2", title: "IPL Playoffs (Sample)", location: "Mumbai", date: "2026-05-20", severity: "high", impact: "High hotel & flight demand - Local transport crowded", recommendedAction: "If visiting for the match, book transport ahead and plan longer arrival buffers to stadiums." },
    { id: "e3", title: "Classical Music Fest", location: "Thiruvananthapuram", date: "2025-11-09", severity: "medium", impact: "Moderate; few boutique hotels fill fast", recommendedAction: "Book boutique stays early; inland transport smooth but limited late-night cabs." },
  ];
}
function simpleMockHotPlaces() {
  return [
    { id: "h1", title: "Goa", subtitle: "Perfect weather + off-peak weekday flight deals", reason: "Beaches & nightlife trending", budget: "6,000–8,500", tag: "Beach", image: "/placeholder-trip.jpg" },
    { id: "h2", title: "Rishikesh", subtitle: "Great rafting season, clear skies", reason: "Adventure seekers trending", budget: "3,500–5,000", tag: "Adventure", image: "/placeholder-trip.jpg" },
    { id: "h3", title: "Jaipur", subtitle: "Forts & heritage stays", reason: "Culture & photogenic spots", budget: "2,000–6,000", tag: "Culture", image: "/placeholder-trip.jpg" },
  ];
}
function simpleMockReviews() {
  return [
    { id: "r1", name: "Asha", rating: 4.6, location: "Goa", review: "Loved Baga early morning, avoid late-night crowds on Sundays.", tip: "Book local boat early", emoji: "🏖️" },
    { id: "r2", name: "Rajan", rating: 4.2, location: "Manali", review: "Roads good in October, check for landslip alerts during monsoon.", tip: "Carry warm layers", emoji: "❄️" },
  ];
}
function simpleMockFlights(dest) {
  return [
    { id: "f1", depart: "DEL 06:00", arrive: `${dest} 08:05`, duration: "2h 5m", price: 3500 },
    { id: "f2", depart: "DEL 09:00", arrive: `${dest} 11:05`, duration: "2h 5m", price: 4200 },
  ];
}
function simpleMockTrains(dest) {
  return [
    { id: "t1", depart: "DEL 18:20", arrive: `${dest} 09:15`, duration: "14h 55m", price: 1100, class: "SL/3A" },
    { id: "t2", depart: "DEL 13:20", arrive: `${dest} 03:40`, duration: "14h 20m", price: 1350, class: "2S/CC" },
  ];
}
function simpleMockBuses(dest) {
  return [{ id: "b1", depart: "DEL 21:00", arrive: `${dest} 09:00`, duration: "12h 0m", price: 900 }];
}
function simpleMockCabs(dest) {
  return [{ id: "c1", depart: "Airport", arrive: `${dest} City`, duration: "30m", price: 650, eta: "12 min" }];
}
`;
