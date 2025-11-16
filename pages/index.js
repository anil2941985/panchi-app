export default function Home() {
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
          background: "rgba(255,255,255,0.9)",
          borderRadius: "24px",
          padding: "24px 20px 32px",
          boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "24px", color: "#1E90FF" }}>
            Panchi
          </div>
          <div style={{ fontSize: "14px", opacity: 0.7 }}>India · MVP</div>
        </header>

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
          <h1 style={{ fontSize: "22px", marginBottom: "8px" }}>
            From dreams to destination.
          </h1>
          <p style={{ fontSize: "14px", opacity: 0.9 }}>
            Panchi finds the smartest, safest and cheapest way to travel across
            India. This is the first working MVP.
          </p>
        </section>

        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
            Try a sample plan
          </h2>
          <p style={{ fontSize: "14px", opacity: 0.8, marginBottom: "8px" }}>
            Example: Delhi → Goa for this weekend.
          </p>
          <div
            style={{
              display: "grid",
              gap: "10px",
              gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
            }}
          >
            <div
              style={{
                padding: "10px",
                borderRadius: "14px",
                background: "#F7FBFF",
                border: "1px solid rgba(30,144,255,0.18)",
              }}
            >
              <div style={{ fontSize: "12px", opacity: 0.7 }}>From</div>
              <div style={{ fontWeight: 600 }}>Delhi (DEL)</div>
            </div>
            <div
              style={{
                padding: "10px",
                borderRadius: "14px",
                background: "#F7FFF9",
                border: "1px solid rgba(50,205,50,0.18)",
              }}
            >
              <div style={{ fontSize: "12px", opacity: 0.7 }}>To</div>
              <div style={{ fontWeight: 600 }}>Goa (GOI)</div>
            </div>
            <div
              style={{
                padding: "10px",
                borderRadius: "14px",
                background: "#FFF9F5",
                border: "1px solid rgba(255,111,97,0.25)",
              }}
            >
              <div style={{ fontSize: "12px", opacity: 0.7 }}>Dates</div>
              <div style={{ fontWeight: 600 }}>Fri – Sun</div>
            </div>
          </div>
        </section>
              <div style={{ marginTop: "12px" }}>
          <a
            href="/search"
            style={{
              display: "inline-block",
              padding: "10px 18px",
              borderRadius: "20px",
              background:
                "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#FFB347 100%)",
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 10px 22px rgba(0,0,0,0.18)",
            }}
          >
            View sample cheapest flights →
          </a>
        </div>

        <section>
          <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
            What this MVP can do
          </h2>
          <ul style={{ fontSize: "14px", paddingLeft: "18px" }}>
            <li>Shows mock cheapest flights and cab options.</li>
            <li>Will later add AI itineraries and live price nudges.</li>
            <li>Built for Indian routes first (Delhi, Goa, Manali, Jaipur).</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
