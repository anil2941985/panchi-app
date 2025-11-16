import { useState, useEffect } from "react";

export default function Home() {
  const [storedName, setStoredName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("panchiName");
    if (saved) {
      setStoredName(saved);
      setNameInput(saved);
    }
  }, []);

  const greeting = storedName ? `Hey, ${storedName}` : "Hey,";

  function handleSaveName(e) {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setSavingName(true);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("panchiName", trimmed);
      }
      setStoredName(trimmed);
    } finally {
      setSavingName(false);
    }
  }

  function goToSearchWithCodes(originCode, destinationCode) {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams({
      origin: originCode,
      destination: destinationCode,
    }).toString();
    window.location.href = `/search?${params}`;
  }

  function handleFreeTextSearch(e) {
    e.preventDefault();
    const text = destinationText.toLowerCase();
    let originCode = "DEL";
    let destCode = "GOI";

    if (text.includes("goa")) destCode = "GOI";
    else if (text.includes("manali")) destCode = "KUU";
    else if (text.includes("jaipur")) destCode = "JAI";
    else destCode = "GOI";

    const params = new URLSearchParams({
      origin: originCode,
      destination: destCode,
    }).toString();
    if (typeof window !== "undefined") {
      window.location.href = `/search?${params}`;
    }
  }

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
        {/* Top bar */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src="/panchi-logo.png"
              alt="Panchi Logo"
              style={{ height: "38px", width: "auto" }}
            />
          </div>
          <div style={{ fontSize: "14px", opacity: 0.7 }}>India · MVP</div>
        </header>

        {/* Greeting + where to */}
        <section
          style={{
            borderRadius: "20px",
            padding: "20px 16px",
            background:
              "linear-gradient(135deg, #1E90FF 0%, #FF6F61 50%, #FFB347 100%)",
            color: "#fff",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "18px", marginBottom: "4px" }}>
            {greeting}
          </div>
          <h1 style={{ fontSize: "22px", marginBottom: "6px" }}>
            Where are we going next?
          </h1>
          <p style={{ fontSize: "14px", opacity: 0.9 }}>
            Panchi will find the smartest and cheapest ways to reach your
            destination — starting with flights in this MVP, and later adding
            trains, buses and cabs.
          </p>
        </section>

        {/* Name capture */}
        {!storedName && (
          <form
            onSubmit={handleSaveName}
            style={{
              marginBottom: "18px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <label style={{ fontSize: "13px" }}>
              What should I call you?
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Type your name"
                style={{
                  marginLeft: "8px",
                  padding: "8px 10px",
                  borderRadius: "14px",
                  border: "1px solid rgba(0,0,0,0.14)",
                  fontSize: "13px",
                }}
              />
            </label>
            <button
              type="submit"
              disabled={savingName}
              style={{
                padding: "8px 14px",
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

        {/* Free-text box */}
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
                padding: "10px 12px",
                borderRadius: "16px",
                border: "1px solid rgba(30,144,255,0.4)",
                fontSize: "14px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 18px",
                borderRadius: "20px",
                border: "none",
                background:
                  "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#FFB347 100%)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 10px 22px rgba(0,0,0,0.18)",
              }}
            >
              Let Panchi plan →
            </button>
          </form>
        </section>

        {/* Quick suggestion chips */}
        <section>
          <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>
            Or pick a quick idea
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "6px",
            }}
          >
            <button
              onClick={() => goToSearchWithCodes("DEL", "GOI")}
              style={chipStyle}
            >
              Goa for the weekend 🏖️
            </button>
            <button
              onClick={() => goToSearchWithCodes("DEL", "KUU")}
              style={chipStyle}
            >
              Manali escape ❄️
            </button>
            <button
              onClick={() => goToSearchWithCodes("DEL", "JAI")}
              style={chipStyle}
            >
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

const chipStyle = {
  padding: "8px 14px",
  borderRadius: "20px",
  border: "none",
  fontSize: "13px",
  cursor: "pointer",
  background: "rgba(30,144,255,0.08)",
  color: "#222",
};
