import { useState, useEffect } from "react";

export default function Home() {
  const [storedName, setStoredName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [nudges, setNudges] = useState([]);
  const [nudgesLoading, setNudgesLoading] = useState(false);
  const [nudgesError, setNudgesError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("panchiName");
    if (saved) {
      setStoredName(saved);
      setNameInput(saved);
    }
  }, []);

  useEffect(() => {
    loadNudges();
  }, []);

  async function loadNudges() {
    try {
      setNudgesLoading(true);
      setNudgesError("");
      const res = await fetch("/api/mockNudges");
      if (!res.ok) throw new Error("Failed to load nudges");
      const data = await res.json();
      setNudges(data);
    } catch (err) {
      console.error(err);
      setNudgesError("Could not load nudges right now.");
    } finally {
      setNudgesLoading(false);
    }
  }

  function handleSaveName(e) {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("panchiName", trimmed);
    }
    setStoredName(trimmed);
  }

  function handleFreeTextSearch(e) {
    e.preventDefault();
    const text = destinationText.toLowerCase();
    console.log("User asked for:", text);
    // For now, show the AI-style all-modes decision screen.
    window.location.href = "/all-modes";
  }

  function goToSearch(origin, dest) {
    const params = new URLSearchParams({ origin, destination: dest }).toString();
    window.location.href = `/search?${params}`;
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="/panchi-logo.png"
              alt="Panchi Logo"
              style={{ height: "70px", width: "auto" }}
            />
          </div>
          <div style={{ fontSize: "14px", opacity: 0.7 }}>
            Cheapest trips · MVP
          </div>
        </header>

        {/* HERO CARD */}
        <section
          style={{
            borderRadius: "20px",
            padding: "20px 16px",
            background:
              "linear-gradient(135deg, #1E90FF 0%, #FF6F61 50%, #FFB347 100%)",
            color: "#fff",
            marginBottom: "24px",
          }}
        >
          <div style={{ fontSize: "18px", marginBottom: "4px" }}>
            {greeting}
          </div>
          <h1 style={{ fontSize: "26px", marginBottom: "6px" }}>
            Where are we going next?
          </h1>
          <p style={{ fontSize: "14px", opacity: 0.9 }}>
            Panchi will find the smartest and cheapest ways to reach your
            destination — starting with this MVP that compares flights, trains,
            buses and cabs for you automatically.
          </p>
        </section>

        {/* NAME INPUT (only if name not saved) */}
        {!storedName && (
          <form
            onSubmit={handleSaveName}
            style={{
              marginBottom: "20px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              style={{
                padding: "10px 12px",
                borderRadius: "14px",
                border: "1px solid rgba(0,0,0,0.14)",
                fontSize: "14px",
                flex: "1",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 14px",
                borderRadius: "18px",
                border: "none",
                background:
                  "linear-gradient(135deg,#1E90FF 0%,#FF6F61 60%,#FFB347 100%)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </form>
        )}

        {/* FREE TEXT SEARCH */}
        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
            Tell me a place or a vibe
          </h2>
          <p style={{ fontSize: "14px", opacity: 0.8, marginBottom: "8px" }}>
            Try “Goa”, “Manali”, “Jaipur” or “beach under 5k”.
          </p>

          <form
            onSubmit={handleFreeTextSearch}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <input
              value={destinationText}
              onChange={(e) => setDestinationText(e.target.value)}
              placeholder="Where to? (city, hill station, beach...)"
              style={{
                flex: "1 1 240px",
                padding: "12px 12px",
                borderRadius: "16px",
                border: "1px solid rgba(30,144,255,0.4)",
                fontSize: "14px",
              }}
            />

            <button
              type="submit"
              style={{
                padding: "12px 18px",
                borderRadius: "20px",
                border: "none",
                background:
                  "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#FFB347 100%)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Let Panchi plan →
            </button>
          </form>
        </section>

        {/* QUICK SUGGESTIONS */}
        <section style={{ marginBottom: "22px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>
            Or pick a quick idea
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <button style={chip} onClick={() => goToSearch("DEL", "GOI")}>
              Goa for the weekend 🏖️
            </button>
            <button style={chip}>Manali escape ❄️ (coming soon)</button>
            <button style={chip}>Jaipur & forts 🏰 (coming soon)</button>
          </div>

          <p style={{ fontSize: "13px", opacity: 0.75 }}>
            For now we start from Delhi and show how Panchi will compare every
            mode on one screen. Live APIs and AI itineraries are the next step.
          </p>
        </section>

        {/* SMART NUDGES */}
        <section style={{ marginBottom: 22 }}>
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>
            Smart nudges for this week (sample)
          </h3>

          {nudgesLoading && (
            <p style={{ fontSize: 13, opacity: 0.75 }}>Loading nudges…</p>
          )}

          {nudgesError && (
            <p
              style={{
                fontSize: 13,
                color: "#B00020",
                background: "#FFF4F4",
                padding: "8px 10px",
                borderRadius: 12,
                marginBottom: 8,
              }}
            >
              {nudgesError}
            </p>
          )}

          {!nudgesLoading && nudges.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 10,
              }}
            >
              {nudges.map((nudge) => (
                <div
                  key={nudge.id}
                  style={{
                    borderRadius: 16,
                    padding: "10px 12px",
                    background: "rgba(30,144,255,0.04)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{nudge.icon}</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {nudge.title}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.8,
                      marginBottom: 4,
                    }}
                  >
                    {nudge.detail}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      opacity: 0.9,
                      padding: "6px 8px",
                      borderRadius: 999,
                      background: "rgba(255,111,97,0.08)",
                    }}
                  >
                    {nudge.impact}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p
            style={{
              fontSize: 11,
              opacity: 0.7,
              marginTop: 6,
            }}
          >
            In the full version, these nudges will be powered by live weather,
            traffic, surge pricing and event data personalised to your trip.
          </p>
        </section>

        {/* EXPLORE BY MODE – stitches all pages */}
        <section style={{ marginBottom: 18 }}>
          <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>
            Explore by mode (MVP screens)
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <a href="/search" style={{ textDecoration: "none" }}>
              <button style={modePillPrimary}>Flights</button>
            </a>

            <a href="/trains" style={{ textDecoration: "none" }}>
              <button style={modePill}>Trains</button>
            </a>

            <a href="/buses" style={{ textDecoration: "none" }}>
              <button style={modePill}>Buses</button>
            </a>

            <a href="/cabs" style={{ textDecoration: "none" }}>
              <button style={modePill}>Cabs</button>
            </a>

            <a href="/all-modes" style={{ textDecoration: "none" }}>
              <button style={modePillOutline}>All modes view</button>
            </a>
          </div>

          <p style={{ fontSize: "12px", opacity: 0.7, marginTop: "8px" }}>
            These are working MVP screens with mock data for Delhi → Goa, to
            show how Panchi will compare every option on one platform.
          </p>
        </section>

        {/* JOIN WAITLIST CTA */}
        <section
          style={{
            marginTop: 4,
            paddingTop: 10,
            borderTop: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 13, opacity: 0.8, maxWidth: 420 }}>
              Want to try the full AI travel companion when it’s ready?
              Join the early access list and we’ll share the next builds with you
              and selected investors.
            </div>
            <a href="/waitlist" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "9px 18px",
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#FFB347 100%)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.16)",
                }}
              >
                Join waitlist
              </button>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

const chip = {
  padding: "8px 14px",
  borderRadius: "20px",
  border: "none",
  fontSize: "13px",
  cursor: "pointer",
  background: "rgba(30,144,255,0.08)",
  color: "#222",
};

const modePillBase = {
  padding: "9px 16px",
  borderRadius: "999px",
  border: "none",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
};

const modePillPrimary = {
  ...modePillBase,
  background:
    "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#FFB347 100%)",
  color: "#fff",
  boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
};

const modePill = {
  ...modePillBase,
  background: "rgba(30,144,255,0.06)",
  color: "#222",
};

const modePillOutline = {
  ...modePillBase,
  background: "transparent",
  border: "1px solid rgba(30,144,255,0.4)",
  color: "#1E90FF",
};
