import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MIN_AGE = 13;

const COUNTRIES = [
  { code: "+20", iso: "eg", label: "Egypt" },
  { code: "+966", iso: "sa", label: "Saudi Arabia" },
  { code: "+971", iso: "ae", label: "UAE" },
];

const flagUrl = (iso) => `https://flagcdn.com/24x18/${iso}.png`;

const initialForm = {
  name: "",
  email: "",
  countryCode: COUNTRIES[0].code,
  phone: "",
  password: "",
  confirmPassword: "",
  birthday: "",
};

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a19.86 19.86 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a19.86 19.86 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function calcAge(dateStr) {
  if (!dateStr) return null;

  const today = new Date();
  const dob = new Date(dateStr);

  let age = today.getFullYear() - dob.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() &&
      today.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}

function FormPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const countryRef = useRef(null);

  const selectedCountry = COUNTRIES.find(
    (country) => country.code === form.countryCode
  );

  const todayStr = new Date().toISOString().split("T")[0];
  const age = calcAge(form.birthday);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        countryRef.current &&
        !countryRef.current.contains(event.target)
      ) {
        setCountryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function handlePhoneChange(event) {
    let digits = event.target.value.replace(/\D/g, "");

    const codeDigits = form.countryCode.replace("+", "");

    if (digits.startsWith(codeDigits)) {
      digits = digits.slice(codeDigits.length);
    }

    if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }

    setForm((previousForm) => ({
      ...previousForm,
      phone: digits,
    }));
  }

  function selectCountry(code) {
    setForm((previousForm) => ({
      ...previousForm,
      countryCode: code,
    }));

    setCountryOpen(false);
  }

  const passwordChecks = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    symbol: /[^A-Za-z0-9]/.test(form.password),
  };

  const passwordValid = Object.values(passwordChecks).every(Boolean);

  const confirmTouched = form.confirmPassword.length > 0;
  const passwordsMatch = form.password === form.confirmPassword;

  const requirements = [
    {
      key: "length",
      label: "At least 8 characters",
      met: passwordChecks.length,
    },
    {
      key: "uppercase",
      label: "One uppercase letter",
      met: passwordChecks.uppercase,
    },
    {
      key: "number",
      label: "One number",
      met: passwordChecks.number,
    },
    {
      key: "symbol",
      label: "One symbol (!@#$%...)",
      met: passwordChecks.symbol,
    },
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors([]);

    if (!passwordValid) {
      setErrors([
        "Password doesn't meet all the requirements yet.",
      ]);
      return;
    }

    if (!passwordsMatch) {
      setErrors(["Passwords don't match."]);
      return;
    }

    if (!form.birthday) {
      setErrors(["Please enter your birthday."]);
      return;
    }

    if (age === null || age < MIN_AGE) {
      setErrors([
        `You must be at least ${MIN_AGE} years old to sign up.`,
      ]);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          birthday: form.birthday,
          phone: `${form.countryCode} ${form.phone}`.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(
          data.errors || ["Something went wrong. Please try again."]
        );
        setSubmitting(false);
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setErrors([
        "Could not reach the server. Is it running?",
      ]);

      setSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <div className="form-visual">
        <img
          src="/Pantalon.png"
          alt="GenZ streetwear"
          className="form-visual-img"
        />

        <div className="form-visual-overlay">
          <Link to="/" className="form-visual-logo">
            <img src="/genz-logo.png" alt="GenZ" />
          </Link>

          <div className="form-visual-copy">
            <p className="eyebrow">
              New Cairo · Sheikh Zayed · Riyadh
            </p>

            <h2>
              Every local label,
              <br />
              worn well.
            </h2>
          </div>
        </div>
      </div>

      <div className="form-side">
        <div className="form-card">
          <p className="eyebrow">Join GenZ</p>

          <h1>Create your account</h1>

          <p className="form-subtitle">
            One account gets you into every label under the GenZ roof.
          </p>

          {errors.length > 0 && (
            <ul className="form-errors">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} noValidate={false}>
            <div className="field">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Nour Ahmed"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.com$"
                title="Please enter a valid email address ending with .com"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="phone">Phone number</label>

              <div className="phone-row">
                <div
                  className="country-select-wrap"
                  ref={countryRef}
                >
                  <button
                    type="button"
                    className="country-select"
                    onClick={() =>
                      setCountryOpen((previousState) => !previousState)
                    }
                    aria-expanded={countryOpen}
                  >
                    <img
                      src={flagUrl(selectedCountry.iso)}
                      alt={selectedCountry.label}
                    />

                    <span>{selectedCountry.code}</span>

                    <ChevronIcon />
                  </button>

                  {countryOpen && (
                    <ul
                      className="country-dropdown"
                      role="listbox"
                    >
                      {COUNTRIES.map((country) => (
                        <li
                          key={country.code}
                          role="option"
                          aria-selected={
                            country.code === form.countryCode
                          }
                          className={
                            country.code === form.countryCode
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            selectCountry(country.code)
                          }
                        >
                          <img
                            src={flagUrl(country.iso)}
                            alt={country.label}
                          />

                          <span className="country-name">
                            {country.label}
                          </span>

                          <span className="country-code">
                            {country.code}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="100 000 0000"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="password">Password</label>

                <div className="password-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    className={
                      form.password.length > 0 && passwordValid
                        ? "valid"
                        : ""
                    }
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() =>
                      setShowPassword(
                        (previousState) => !previousState
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon />
                    ) : (
                      <EyeIcon />
                    )}
                  </button>
                </div>
              </div>

              <div className="field">
                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <div className="password-wrap">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={
                      confirmTouched
                        ? passwordsMatch
                          ? "valid"
                          : "invalid"
                        : ""
                    }
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previousState) => !previousState
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon />
                    ) : (
                      <EyeIcon />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <ul className="password-requirements">
              {requirements.map((requirement) => (
                <li
                  key={requirement.key}
                  className={requirement.met ? "met" : ""}
                >
                  <span className="req-icon">
                    {requirement.met && <CheckIcon />}
                  </span>

                  {requirement.label}
                </li>
              ))}
            </ul>

            <div className="field">
              <label htmlFor="birthday">Birthday</label>

              <input
                id="birthday"
                name="birthday"
                type="date"
                value={form.birthday}
                onChange={handleChange}
                max={todayStr}
                required
              />

              {form.birthday && (
                <span
                  className={`age-hint ${
                    age !== null && age < MIN_AGE
                      ? "invalid"
                      : "valid"
                  }`}
                >
                  {age !== null && age < MIN_AGE
                    ? `You must be at least ${MIN_AGE} years old.`
                    : `Age: ${age}`}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary form-submit"
              disabled={submitting}
            >
              {submitting
                ? "Creating account…"
                : "Create account"}
            </button>
          </form>

          <p className="form-footnote">
            Already have an account?{" "}
            <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FormPage;