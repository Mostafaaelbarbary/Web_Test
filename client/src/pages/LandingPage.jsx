import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/shared.css";
import "../styles/landing.css";

const BENEFITS = [
  {
    title: "Multiple local brands",
    text: "Discover curated Egyptian and regional labels in one place.",
  },
  {
    title: "Three locations",
    text: "Visit us in New Cairo, Sheikh Zayed, and Saudi Arabia.",
  },
  {
    title: "One fitting experience",
    text: "Compare styles, sizes, and brands under one roof.",
  },
  {
    title: "Community driven",
    text: "Join launches, events, drops, and local fashion experiences.",
  },
];

const FEATURED_BRANDS = [
  {
    name: "CTRL",
    category: "Contemporary Streetwear",
    description:
      "Minimal oversized essentials inspired by modern urban culture.",
    image: "/brand-ctrl.png",
  },
  {
    name: "Denjoe",
    category: "Modern Women's Fashion",
    description:
      "Clean silhouettes, elegant tones, and polished everyday pieces.",
    image: "/brand-denjoe.png",
  },
  {
    name: "KNTD",
    category: "Graphic Streetwear",
    description:
      "Bold graphics, expressive fits, and youth-driven local style.",
    image: "/brand-kntd.png",
  },
  {
    name: "GAIA",
    category: "Premium Casual",
    description:
      "Elevated basics, relaxed cuts, and versatile wardrobe staples.",
    image: "/brand-gaia.png",
  },
  {
    name: "27",
    category: "Youth Essentials",
    description:
      "Relaxed everyday sets, soft color stories, and easy Gen Z styling.",
    image: "/brand-27.png",
  },
];

function SearchIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem("genz_user"))
  );

  function handlePrimaryAction() {
    navigate(isLoggedIn ? "/dashboard" : "/register");
  }

  function handleSignOut() {
    localStorage.removeItem("genz_user");
    setIsLoggedIn(false);
    navigate("/");
  }

  return (
    <div className="store-home">
      <div className="store-announcement">
        <span>New Cairo · Sheikh Zayed · Saudi Arabia</span>

        <p>
          Discover Egypt&apos;s best local labels under one roof
        </p>

        <div>
          {isLoggedIn ? (
            <button type="button" onClick={handleSignOut}>
              Sign out
            </button>
          ) : (
            <Link to="/login">Sign in</Link>
          )}
        </div>
      </div>

      <header className="store-navbar">
        <Link to="/" className="store-logo" aria-label="GenZ homepage">
          <img src="/genz-logo.png" alt="GenZ" />
        </Link>

        <nav>
          <a href="#home">Home</a>
          <a href="#brands">Brands</a>
          <a href="#locations">Locations</a>
          <a href="#about">About</a>
        </nav>

        <div className="store-nav-actions">
          <button type="button" aria-label="Search">
            <SearchIcon />
          </button>

          <button
            type="button"
            aria-label="Account"
            onClick={() =>
              navigate(isLoggedIn ? "/dashboard" : "/login")
            }
          >
            <UserIcon />
          </button>

          <button type="button" aria-label="Wishlist">
            <HeartIcon />
          </button>
        </div>
      </header>

      <main>
        <section className="store-hero" id="home">
          <div className="store-hero-content">
            <p className="store-eyebrow">Local fashion destination</p>

            <h1>
              All your favorite
              <span> local brands.</span>
            </h1>

            <p className="store-hero-description">
              Shop, discover, and experience independent labels from Egypt
              and the region in one curated destination.
            </p>

            <button
              type="button"
              className="store-primary-btn"
              onClick={handlePrimaryAction}
            >
              {isLoggedIn ? "Open dashboard" : "Explore GenZ"}
              <ArrowIcon />
            </button>
          </div>

          <div className="store-hero-image" aria-hidden="true">
            <img
              src="/Test2.png"
              alt=""
            />
          </div>
        </section>

        <section className="store-benefits" id="experience">
          {BENEFITS.map((benefit, index) => (
            <article key={benefit.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>

              <div>
                <h2>{benefit.title}</h2>
                <p>{benefit.text}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="store-featured-brands" id="brands">
          <div className="store-featured-header">
            <div>
              <p className="store-eyebrow">Featured local labels</p>
              <h2>Different identities. One destination.</h2>
            </div>

            <p>
              Meet a selection of the brands shaping Egypt&apos;s fashion scene,
              all available inside the GenZ retail experience.
            </p>
          </div>

          <div className="store-brand-grid">
            {FEATURED_BRANDS.map((brand, index) => (
              <article
                className={`store-brand-card ${
                  index === 0 || index >= 3
                    ? "store-brand-card--large"
                    : ""
                }`}
                key={brand.name}
              >
                <img
                  src={brand.image}
                  alt={`${brand.name} inside GenZ`}
                />

                <div className="store-brand-overlay">
                  <p>{brand.category}</p>
                  <h3>{brand.name}</h3>
                  <span>{brand.description}</span>

                  <button type="button">
                    View brand
                    <ArrowIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="store-event-section">
          <div className="store-event-image">
            <img
              src="/genz-event.png"
              alt="GenZ community event inside the store"
            />
            <span>Real GenZ community event</span>
          </div>

          <div className="store-event-copy">
            <p className="store-eyebrow">Events and community</p>

            <h2>
              Local fashion is better when people experience it together.
            </h2>

            <p>
              GenZ is more than a place to browse clothes. The stores host
              launches, creator visits, community gatherings, and moments that
              connect customers directly with the people shaping local fashion.
            </p>

            <div className="store-event-features">
              <div>
                <strong>Live launches</strong>
                <span>Meet brands and discover new drops in person.</span>
              </div>

              <div>
                <strong>Creator events</strong>
                <span>Bring fashion, content, and local culture together.</span>
              </div>

              <div>
                <strong>Real community</strong>
                <span>Build stronger connections around Egyptian labels.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="store-intro">
          <div>
            <p className="store-eyebrow">Made local. Worn everywhere.</p>

            <h2>
              A platform built to give local labels the space they deserve.
            </h2>
          </div>

          <p>
            GenZ combines multiple brands in one physical experience, making
            it easier for customers to discover new collections, compare
            products, attend launches, and connect with local fashion culture.
          </p>
        </section>

        <section className="store-locations" id="locations">
          <div className="store-location-heading">
            <p className="store-eyebrow">Visit us</p>
            <h2>Three branches. One GenZ experience.</h2>
          </div>

          <div className="store-location-grid">
            <article>
              <span>01</span>
              <h3>New Cairo</h3>
              <p>Park Mall · Ground floor</p>

              <a
                className="store-map-btn"
                href="https://www.google.com/maps/search/?api=1&query=Park%20Mall%20New%20Cairo"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on map
                <ArrowIcon />
              </a>
            </article>

            <article>
              <span>02</span>
              <h3>Sheikh Zayed</h3>
              <p>Royal Park Mall · Level 1</p>

              <a
                className="store-map-btn"
                href="https://www.google.com/maps/search/?api=1&query=Royal%20Park%20Mall%20Sheikh%20Zayed"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on map
                <ArrowIcon />
              </a>
            </article>

            <article>
              <span>03</span>
              <h3>Saudi Arabia</h3>
              <p>Souq 7 · KSA</p>

              <a
                className="store-map-btn"
                href="https://www.google.com/maps/search/?api=1&query=Souq%207%20Saudi%20Arabia"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on map
                <ArrowIcon />
              </a>
            </article>
          </div>
        </section>

        <section className="store-about" id="about">
          <div>
            <p className="store-eyebrow">One account. One community.</p>

            <h2>Stay connected to every label under the GenZ roof.</h2>
          </div>

          <button
            type="button"
            className="store-primary-btn"
            onClick={handlePrimaryAction}
          >
            {isLoggedIn ? "Go to dashboard" : "Create account"}
            <ArrowIcon />
          </button>
        </section>
      </main>

      <footer className="store-footer">
        <img src="/genz-logo.png" alt="GenZ" />

        <p>
          Egypt&apos;s destination for local brands, community, and fashion
          experiences.
        </p>

        <small>© 2026 GenZ. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default LandingPage;
