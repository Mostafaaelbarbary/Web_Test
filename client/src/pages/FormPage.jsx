import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/shared.css";
import "../styles/register.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const MIN_AGE = 13;

const COUNTRIES = [
  {
    code: "+20",
    iso: "eg",
    label: "Egypt",
    localDigits: 10,
  },
  {
    code: "+966",
    iso: "sa",
    label: "Saudi Arabia",
    localDigits: 9,
  },
  {
    code: "+971",
    iso: "ae",
    label: "UAE",
    localDigits: 9,
  },
];

const initialForm = {
  name: "",
  email: "",
  countryCode: COUNTRIES[0].code,
  phone: "",
  password: "",
  confirmPassword: "",
  birthday: "",
};

const flagUrl = (iso) =>
  `https://flagcdn.com/24x18/${iso}.png`;

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
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
      aria-hidden="true"
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
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
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
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function calculateAge(dateString) {
  if (!dateString) return null;

  const today = new Date();
  const birthday = new Date(`${dateString}T00:00:00`);

  let age = today.getFullYear() - birthday.getFullYear();

  const birthdayPassed =
    today.getMonth() > birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() &&
      today.getDate() >= birthday.getDate());

  if (!birthdayPassed) {
    age -= 1;
  }

  return age;
}

function FormPage() {
  const navigate = useNavigate();
  const countryRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const selectedCountry =
    COUNTRIES.find(
      (country) => country.code === form.countryCode
    ) || COUNTRIES[0];

  const age = calculateAge(form.birthday);
  const todayString = new Date().toISOString().split("T")[0];

  const passwordChecks = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    symbol: /[^A-Za-z0-9]/.test(form.password),
  };

  const passwordValid =
    Object.values(passwordChecks).every(Boolean);

  const confirmTouched = form.confirmPassword.length > 0;
  const passwordsMatch =
    form.password === form.confirmPassword;

  const passwordRequirements = [
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
      label: "One symbol",
      met: passwordChecks.symbol,
    },
  ];

  useEffect(() => {
    function closeCountryMenu(event) {
      if (
        countryRef.current &&
        !countryRef.current.contains(event.target)
      ) {
        setCountryOpen(false);
      }
    }

    document.addEventListener("mousedown", closeCountryMenu);

    return () => {
      document.removeEventListener(
        "mousedown",
        closeCountryMenu
      );
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
    const digits = event.target.value
      .replace(/\D/g, "")
      .slice(0, selectedCountry.localDigits);

    setForm((previousForm) => ({
      ...previousForm,
      phone: digits,
    }));
  }

  function selectCountry(country) {
    setForm((previousForm) => ({
      ...previousForm,
      countryCode: country.code,
      phone: "",
    }));

    setCountryOpen(false);
  }

  function validateForm() {
    const validationErrors = [];

    if (!form.name.trim()) {
      validationErrors.push("Please enter your full name.");
    }

    const email = form.email.trim().toLowerCase();

    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[.]com$/i.test(
        email
      )
    ) {
      validationErrors.push(
        "Please enter a valid email ending with .com."
      );
    }

    if (
      form.phone.length !== selectedCountry.localDigits
    ) {
      validationErrors.push(
        `${selectedCountry.label} phone numbers must contain ${selectedCountry.localDigits} digits after the country code.`
      );
    }

    if (!passwordValid) {
      validationErrors.push(
        "Password does not meet all requirements."
      );
    }

    if (!passwordsMatch) {
      validationErrors.push("Passwords do not match.");
    }

    if (!form.birthday) {
      validationErrors.push("Please enter your birthday.");
    } else if (age === null || age < MIN_AGE) {
      validationErrors.push(
        `You must be at least ${MIN_AGE} years old.`
      );
    }

    return validationErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors([]);

    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/entries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: `${form.countryCode}${form.phone}`,
            password: form.password,
            birthday: form.birthday,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes(
        "application/json"
      )
        ? await response.json()
        : null;

      if (!response.ok) {
        setErrors(
          data?.errors || [
            "Something went wrong. Please try again.",
          ]
        );
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Signup request failed:", error);

      setErrors([
        "Could not reach the server. Please make sure the backend is running.",
      ]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="signup-page">
      <div
        className="signup-background"
        aria-hidden="true"
      />
      <div
        className="signup-overlay"
        aria-hidden="true"
      />

      <Link
        to="/"
        className="signup-brand"
        aria-label="Return to homepage"
      >
        <img src="/genz-logo.png" alt="GenZ" />
      </Link>

      <section className="signup-card">
        <header className="signup-card-header">
          <p className="signup-eyebrow">Join GenZ</p>

          <h1>Create your account</h1>

          <p>
            One account gets you into every label under
            the GenZ roof.
          </p>
        </header>

        {errors.length > 0 && (
          <div
            className="signup-errors"
            role="alert"
            aria-live="polite"
          >
            <strong>Please check the following:</strong>

            <ul>
              {errors.map((error, index) => (
                <li key={`${error}-${index}`}>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form
          className="signup-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="signup-field">
            <label htmlFor="name">Full name</label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Mostafa Wael"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="phone">Phone number</label>

            <div className="signup-phone-row">
              <div
                className="signup-country-wrapper"
                ref={countryRef}
              >
                <button
                  type="button"
                  className="signup-country-button"
                  onClick={() =>
                    setCountryOpen(
                      (previousValue) => !previousValue
                    )
                  }
                  aria-expanded={countryOpen}
                  aria-haspopup="listbox"
                >
                  <img
                    src={flagUrl(selectedCountry.iso)}
                    alt=""
                  />
                  <span>{selectedCountry.code}</span>
                  <ChevronIcon />
                </button>

                {countryOpen && (
                  <ul
                    className="signup-country-menu"
                    role="listbox"
                  >
                    {COUNTRIES.map((country) => (
                      <li
                        key={country.code}
                        role="option"
                        aria-selected={
                          country.code ===
                          form.countryCode
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            selectCountry(country)
                          }
                        >
                          <img
                            src={flagUrl(country.iso)}
                            alt=""
                          />

                          <span className="country-label">
                            {country.label}
                          </span>

                          <span className="country-code">
                            {country.code}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder={`${selectedCountry.localDigits} digits`}
                value={form.phone}
                onChange={handlePhoneChange}
                maxLength={selectedCountry.localDigits}
                required
              />
            </div>

            <small className="signup-field-hint">
              Enter {selectedCountry.localDigits} digits
              after {selectedCountry.code}.
            </small>
          </div>

          <div className="signup-two-columns">
            <div className="signup-field">
              <label htmlFor="password">Password</label>

              <div className="signup-password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                  className={
                    form.password && passwordValid
                      ? "input-valid"
                      : ""
                  }
                  required
                />

                <button
                  type="button"
                  className="signup-visibility-button"
                  onClick={() =>
                    setShowPassword(
                      (previousValue) => !previousValue
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

            <div className="signup-field">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <div className="signup-password-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={
                    confirmTouched
                      ? passwordsMatch
                        ? "input-valid"
                        : "input-invalid"
                      : ""
                  }
                  required
                />

                <button
                  type="button"
                  className="signup-visibility-button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previousValue) =>
                        !previousValue
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

          <ul className="signup-password-rules">
            {passwordRequirements.map(
              (requirement) => (
                <li
                  key={requirement.key}
                  className={
                    requirement.met ? "met" : ""
                  }
                >
                  <span>
                    {requirement.met && <CheckIcon />}
                  </span>
                  {requirement.label}
                </li>
              )
            )}
          </ul>

          <div className="signup-field">
            <label htmlFor="birthday">Birthday</label>

            <input
              id="birthday"
              name="birthday"
              type="date"
              value={form.birthday}
              onChange={handleChange}
              max={todayString}
              required
            />

            {form.birthday && (
              <small
                className={
                  age !== null && age >= MIN_AGE
                    ? "signup-age valid"
                    : "signup-age invalid"
                }
              >
                {age !== null && age >= MIN_AGE
                  ? `Age: ${age}`
                  : `You must be at least ${MIN_AGE} years old.`}
              </small>
            )}
          </div>

          <button
            type="submit"
            className="signup-submit"
            disabled={submitting}
          >
            {submitting
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>

        <p className="signup-login-link">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}


export default FormPage;
