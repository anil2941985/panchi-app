// pages/waitlist.js

export default function Waitlist() {
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
          maxWidth: 720,
          margin: "0 auto",
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
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
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <a
              href="/"
              style={{
                textDecoration: "none",
                fontSize: 20,
                color: "#1E90FF",
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              ◀︎
            </a>
            <img
              src="/panchi-logo.png"
              alt="Panchi Logo"
              style={{ height: 46, width: "auto" }}
            />
          </div>

          <div style={{ fontSize: 14, opacity: 0.7 }}>Waitlist · MVP</div>
        </header>

        <h1 style={{ fontSize: 24, marginBottom: 8 }}>
          Join the Panchi early access list
        </h1>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 20 }}>
          Be the first to try Panchi when we launch full AI planning, real-time
          price drops and multi-mode journeys across India. You’ll only get
          important updates&mdash;no spam.
        </p>

        {/* FORM – sent via FormSubmit to your email */}
        <form
          action="https://formsubmit.co/anilkuhadwal@gmail.com"
          method="POST"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* FormSubmit options */}
          <input type="hidden" name="_captcha" value="false" />
          <input
            type="hidden"
            name="_subject"
            value="New Panchi Waitlist signup"
          />
          <input
            type="hidden"
            name="_template"
            value="table"
          />
          <input
            type="hidden"
            name="_next"
            value="https://panchi-app.vercel.app/waitlist"
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 220px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                Name*
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your full name"
                style={inputStyle}
              />
            </div>

            <div style={{ flex: "1 1 220px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                Email*
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@email.com"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 220px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                Phone (optional)
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 ..."
                style={inputStyle}
              />
            </div>

            <div style={{ flex: "1 1 220px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                What type of traveller are you?
              </label>
              <select name="travellerType" style={inputStyle}>
                <option value="">Select one</option>
                <option value="solo">Solo explorer</option>
                <option value="family">Family trips</option>
                <option value="friends">Friends group</option>
                <option value="business">Business traveller</option>
                <option value="creator">Content creator / influencer</option>
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              Where do you want Panchi to help you next? (optional)
            </label>
            <textarea
              name="message"
              rows={3}
              placeholder="E.g. Goa under 6k, road-trip to Spiti, Ladakh bike plan..."
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: 8,
              padding: "12px 16px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background:
                "linear-gradient(135deg,#1E90FF 0%,#FF6F61 50%,#FFB347 100%)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
            }}
          >
            Join waitlist
          </button>

          <p
            style={{
              fontSize: 11,
              opacity: 0.7,
              marginTop: 6,
            }}
          >
            By joining, you agree to be contacted about Panchi updates and
            early access. You can opt out anytime.
          </p>
        </form>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.14)",
  fontSize: 13,
  outline: "none",
};
