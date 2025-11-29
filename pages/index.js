import { useState, useEffect } from "react";

export default function Home() {
  const [storedName, setStoredName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [destinationText, setDestinationText] = useState("");

  // NUDGES
  const [nudges, setNudges] = useState([]);
  const [nudgesLoading, setNudgesLoading] = useState(false);
  const [nudgesError, setNudgesError] = useState("");

  // HOT PLACES
  const [hotPlaces, setHotPlaces] = useState([]);
  const [hotLoading, setHotLoading] = useState(false);
  const [hotError, setHotError] = useState("");

  // NAME LOAD
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("panchiName");
    if (saved) {
      setStoredName(saved);
      setNameInput(saved);
    }
  }, []);

  // LOAD NUDGES + HOT PLACES
  useEffect(() => {
    loadNudges();
    loadHotPlaces();
  }, []);

  // ----- FETCH NUDGES API -----
  async function loadNudges() {
    try {
      setNudgesLoading(true);
      const res = await fetch("/api/mockNudges");
      if (!res.ok) throw new Error("Failed nudges");
      const data = await res.json();
      setNudges(data);
    } catch (err) {
      setNudgesError("Could not load nudges.");
    } finally {
      setNudgesLoading(false);
    }
  }

  // ----- FETCH HOT PLACES API -----
  async function loadHotPlaces() {
    try {
      setHotLoading(true);
      const res = await fetch("/api/mockHotPlaces");
      if (!res.ok) throw new Error("Failed hot places");
      const data = await res.json();
      setHotPlaces(data);
    } catch (err) {
      setHotError("Hot places unavailable right now.");
    } finally {
      setHotLoading(false);
    }
  }

  // SAVE NAME
  function handleSaveName(e) {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    window.localStorage.setItem("panchiName", trimmed);
    setStoredName(trimmed);
  }

  // FREE TEXT → AI PLANNER
  function handleFreeTextSearch(e) {
    e.preventDefault();
    window.location.href = "/all-modes";
  }

  function goToSearch(o, d) {
    window.location.href = `/search?origin=${o}&destination=${d}`;
  }

  const greeting = storedName ? `Hey, ${storedName}` : "Hey,";

  return (
    <main
      style={{
        fontFamily: "Poppins, system-ui, sans-serif",
        minHeight: "100vh",
        padding: "24px",
        background:
          "linear-gradient(135deg, #1E90FF 0%, #FF6F61 50%, #32CD32 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.92)",
          borderRadius: "24px",
          padding: "24px 20px 32px",
          boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <img
            src="/panchi-logo.png"
            alt="Panchi Logo"
            style={{ height: "70px" }}
          />
          <div style={{ fontSize: "14px", opacity: 0.7 }}>
            Cheapest trips · MVP
          </div>
        </header>

        {/* HERO */}
        <section
          style={{
            borderRadius: "20px",
            padding: "20px 16px",
            background:
              "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#FFB347 100%)",
            color: "#fff",
            marginBottom: "24px",
          }}
        >
          <div style={{ fontSize: "18px" }}>{greeting}</div>
          <h1 style={{ fontSize: "26px", marginBottom: "6px" }}>
            Where are we going next?
          </h1>
          <p style={{ fontSize: "14px" }}>
            Panchi finds the smartest and cheapest ways to reach your destination.
          </p>
        </section>

        {/* NAME INPUT */}
        {!storedName && (
          <form
            onSubmit={handleSaveName}
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.14)",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 14px",
                borderRadius: 18,
                border: "none",
                background:
                  "linear-gradient(135deg,#1E90FF 0%,#FF6F61 60%,#FFB347 100%)",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Save
            </button>
          </form>
        )}

        {/* FREE TEXT BOX */}
        <form
          onSubmit={handleFreeTextSearch}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 22,
          }}
        >
          <input
            value={destinationText}
            onChange={(e) => setDestinationText(e.target.value)}
            placeholder="Goa, Manali, beach trip under 5k..."
            style={{
              flex: "1 1 240px",
              padding: "12px 12px",
              borderRadius: 16,
              border: "1px solid rgba(30,144,255,0.4)",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 18px",
              borderRadius: 20,
              border: "none",
              background:
                "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#FFB347 100%)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Let Panchi plan →
          </button>
        </form>

        {/* QUICK SUGGESTIONS */}
        <section style={{ marginBottom: 22 }}>
          <h3>Quick ideas</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={chip} onClick={() => goToSearch("DEL", "GOI")}>
              Goa weekend 🏖️
            </button>
            <button style={chip}>Manali cold ❄️ (soon)</button>
            <button style={chip}>Jaipur forts 🏰 (soon)</button>
          </div>

          <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
            Live APIs coming soon.
          </p>
        </section>

        {/* SMART NUDGES */}
        <section style={{ marginBottom: 26 }}>
          <h3>Smart nudges for this week</h3>

          {nudgesLoading && <p>Loading nudges…</p>}
          {nudgesError && <p>{nudgesError}</p>}

          {!nudgesLoading && nudges.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 12,
              }}
            >
              {nudges.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "12px",
                    borderRadius: 16,
                    background: "rgba(30,144,255,0.06)",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>
                    {item.icon} {item.title}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    {item.detail}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      background: "rgba(255,111,97,0.08)",
                      padding: "6px 8px",
                      borderRadius: 999,
                      fontSize: 11,
                    }}
                  >
                    {item.impact}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* HOT PLACES SECTION */}
        <section style={{ marginBottom: 28 }}>
          <h3>🔥 Hot places in India right now</h3>

          {hotLoading && <p>Loading places…</p>}
          {hotError && <p>{hotError}</p>}

          {!hotLoading && hotPlaces.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              {hotPlaces.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: "14px",
                    borderRadius: 18,
                    background:
                      "linear-gradient(135deg,#1E90FF 0%,#FFB347 80%)",
                    color: "#fff",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  }}
                >
                  <div style={{ fontSize: 22 }}>{p.emoji}</div>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.9 }}>{p.reason}</div>

                  <div
                    style={{
                      marginTop: 6,
                      background: "rgba(255,255,255,0.18)",
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                    }}
                  >
                    {p.temp} · {p.trend}
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 13,
                      background: "rgba(255,255,255,0.15)",
                      padding: "6px 10px",
                      borderRadius: 999,
                    }}
                  >
                    Budget: {p.budget}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* EXPLORE BY MODE */}
        <section>
          <h3>Explore by mode (MVP)</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/search"><button style={modePillPrimary}>Flights</button></a>
            <a href="/trains"><button style={modePill}>Trains</button></a>
            <a href="/buses"><button style={modePill}>Buses</button></a>
            <a href="/cabs"><button style={modePill}>Cabs</button></a>
            <a href="/all-modes"><button style={modePillOutline}>All modes</button></a>
          </div>
        </section>
      </div>
    </main>
  );
}

// STYLES
const chip = {
  padding: "8px 12px",
  borderRadius: 20,
  background: "rgba(30,144,255,0.08)",
  border: "none",
  cursor: "pointer",
};

const modePillBase = {
  padding: "10px 16px",
  borderRadius: 999,
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
};

const modePillPrimary = {
  ...modePillBase,
  background:
    "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#FFB347 100%)",
  color: "#fff",
};

const modePill = {
  ...modePillBase,
  background: "rgba(30,144,255,0.06)",
};

const modePillOutline = {
  ...modePillBase,
  background: "transparent",
  color: "#1E90FF",
  border: "1px solid rgba(30,144,255,0.4)",
};
