import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const CITIES = ["New Cairo", "Sheikh Zayed", "Riyadh"];

const LABELS = [
  { name: "Nour Studio", tag: "Ready-to-wear" },
  { name: "Kayan", tag: "Streetwear" },
  { name: "Layla & Co.", tag: "Accessories" },
  { name: "Habibi Denim", tag: "Denim" },
  { name: "Mira House", tag: "Occasion wear" },
  { name: "Salt & Nile", tag: "Footwear" },
];

const LOCATIONS = [
  {
    city: "New Cairo",
    detail: "Park Mall, ground floor",
    status: "Open now",
  },
  {
    city: "Sheikh Zayed",
    detail: "Royal Park Mall, level 1",
    status: "Open now",
  },
  {
    city: "Riyadh",
    detail: "Souq 7, Jeddah",
    status: "Open now",
  },
];

function LandingPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("genz_user");

  function handleGetStarted() {
    navigate(isLoggedIn ? "/dashboard" : "/register");
  }

  function handleSignOut() {
    localStorage.removeItem("genz_user");
    navigate("/");
  }

  const ctaLabel = isLoggedIn ? "Go to Dashboard" : "Get Started";

  return (
    <div className="landing-page">
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...CITIES, ...CITIES, ...CITIES].map((city, i) => (
            <span className="ticker-item" key={i}>
              {city}
              <span className="ticker-dot">•</span>
            </span>
          ))}
        </div>
      </div>

      <header className="navbar">
        <img src="/genz-logo.png" alt="GenZ" className="logo" />

        <nav>
          <a href="#labels">Labels</a>
          <a href="#locations">Locations</a>
          <a href="#about">About</a>
        </nav>

        <div className="navbar-actions">
          {isLoggedIn && (
            <button className="sign-out-btn" onClick={handleSignOut}>
              Sign out
            </button>
          )}
          <button className="nav-cta" onClick={handleGetStarted}>
            {ctaLabel}
          </button>
        </div>
      </header>

      <main className="hero" id="home">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Est. Cairo — now in KSA</p>
            <h1>
              Every local label
              <br />
              <span>worth wearing.</span>
            </h1>
            <p className="hero-description">
              GenZ brings the best independent fashion houses from Egypt and
              Saudi Arabia under one roof — one store, one fitting room, one
              checkout.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={handleGetStarted}>
                {ctaLabel}
              </button>
              <a href="#labels" className="btn-secondary">
                Browse the labels →
              </a>
            </div>
          </div>

          <div className="hero-figure">
            <div className="hero-card hero-card--tall">
              <img
                src="/Pantalon.png"
                alt="Kayan streetwear sweatpants"
                className="hero-card-img"
              />
              <div className="hero-card-overlay">
                <span className="hero-card-label">Kayan</span>
                <span className="hero-card-tag">Streetwear</span>
              </div>
            </div>
            <div className="hero-card hero-card--short">
              <img
                src="/Crop_top.png"
                alt="Mira House occasion wear top"
                className="hero-card-img"
              />
              <div className="hero-card-overlay">
                <span className="hero-card-label">Mira House</span>
                <span className="hero-card-tag">Occasion wear</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="labels" id="labels">
        <div className="section-head">
          <p className="eyebrow">The roster</p>
          <h2>Labels under one roof</h2>
        </div>

        <div className="labels-grid">
          {LABELS.map((label, i) => (
            <div className="label-card" key={label.name}>
              <span className="label-index">{String(i + 1).padStart(2, "0")}</span>
              <h3>{label.name}</h3>
              <p>{label.tag}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="locations" id="locations">
        <div className="section-head section-head--light">
          <p className="eyebrow">Find us</p>
          <h2>Three cities, one wardrobe</h2>
        </div>

        <div className="locations-list">
          {LOCATIONS.map((loc) => (
            <div className="location-row" key={loc.city}>
              <h3>{loc.city}</h3>
              <p>{loc.detail}</p>
              <span
                className={
                  loc.status === "Open now"
                    ? "status status--open"
                    : "status status--soon"
                }
              >
                {loc.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-strip" id="about">
        <p>
          Submit your details once through a simple form, and review every
          entry from one clear dashboard.
        </p>
        <button className="btn-primary" onClick={handleGetStarted}>
          {ctaLabel}
        </button>
      </section>

      <footer className="footer">
        <img src="/genz-logo.png" alt="GenZ" className="footer-logo" />
        <p>© 2026 GenZ. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
