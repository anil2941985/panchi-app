import { useState, useEffect } from "react";

export default function Home() {
  const [storedName, setStoredName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [destinationText, setDestinationText] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("panchiName");
    if (saved) {
      setStoredName(saved);
      setNameInput(saved);
    }
  }, []);

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

    let origin = "DEL";
    let dest = "GOI";

    if (text.includes("manali")) dest = "KUU";
    else if (text.includes("jaipur")) dest = "JAI";

    const params = new URLSearchParams({
      origin,
      destination: dest,
    }).toString();

    window.location.href = `/search?${params}`;
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
              style={{ height: "70px", width: "auto" }} // BIGGER LOGO
            />
          </div>
          <div style={{ fontSize: "14px", opacity: 0.7 }}>Cheapest flights · MVP</div>
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
            destination — starting with flights in this MVP, and later adding
            trains, buses and cabs.
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
        <section>
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
            <button style={chip} onClick={() => goToSearch("DEL", "KUU")}>
              Manali escape ❄️
            </button>
            <button style={chip} onClick={() => goToSearch("DEL", "JAI")}>
              Jaipur & forts 🏰
            </button>
          </div>

          <p style={{ fontSize: "13px", opacity: 0.75 }}>
            For now we start from Delhi and focus on flights. In the next phase
            we plug in trains, buses and cabs so you see all modes in one view.
          </p>
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
