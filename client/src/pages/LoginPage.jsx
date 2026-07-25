import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/shared.css";
import "../styles/login.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

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

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function validateForm() {
    const validationErrors = [];
    const cleanEmail = form.email.trim().toLowerCase();

    if (!cleanEmail) {
      validationErrors.push("Please enter your email.");
    }

    if (!form.password) {
      validationErrors.push("Please enter your password.");
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
        `${API_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email.trim().toLowerCase(),
            password: form.password,
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
          data?.errors || ["Invalid email or password."]
        );
        return;
      }

      localStorage.setItem(
        "genz_user",
        JSON.stringify(data)
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Login request failed:", error);

      setErrors([
        "Could not reach the server. Please make sure the backend is running.",
      ]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-center-page">
      <div
        className="login-center-background"
        aria-hidden="true"
      />
      <div
        className="login-center-overlay"
        aria-hidden="true"
      />

      <Link
        to="/"
        className="login-center-brand"
        aria-label="Return to homepage"
      >
        <img src="/genz-logo.png" alt="GenZ" />
      </Link>

      <section className="login-center-card">
        <header className="login-center-header">
          <p className="login-center-eyebrow">
            Welcome back
          </p>

          <h1>Log in to GenZ</h1>

          <p>
            Enter your details to access your account
            and every label under the GenZ roof.
          </p>
        </header>

        {errors.length > 0 && (
          <div
            className="login-center-errors"
            role="alert"
            aria-live="polite"
          >
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
          className="login-center-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="login-center-field">
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

          <div className="login-center-field">
            <label htmlFor="password">Password</label>

            <div className="login-center-password">
              <input
                id="password"
                name="password"
                type={
                  showPassword ? "text" : "password"
                }
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="login-center-visibility"
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

          <button
            type="submit"
            className="login-center-submit"
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="login-center-footnote">
          Don&apos;t have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
