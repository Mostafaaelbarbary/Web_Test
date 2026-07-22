const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const SALT_ROUNDS = 10;

// Basic server-side validation so we never trust the client alone.
function validateEntry(body) {
  const errors = [];
  const { name, email, phone, password, birthday } = body;

  if (!name || !name.trim()) {
    errors.push("Name is required.");
  }

  const cleanEmail = String(email || "").trim().toLowerCase();

  if (!cleanEmail.endsWith(".com")) {
    errors.push("Email must end with .com.");
  }

  const phoneDigits = String(phone || "").replace(/\D/g, "");

  if (!phoneDigits) {
    errors.push("Phone number is required.");
  } else if (phoneDigits.length < 11) {
    errors.push("Phone number must contain at least 11 digits.");
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }

  if (!birthday) {
    errors.push("Birthday is required.");
  }

  return errors;
}

// POST /api/entries — create a new submission (used by the Sign Up form)
app.post("/api/entries", async (req, res) => {
  const errors = validateEntry(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const { name, email, phone, password, birthday } = req.body;
  const cleanPhone = phone.trim();
  const cleanEmail = email.trim().toLowerCase();

  try {
    // Pre-check so we can return a friendly, field-specific error
    // (also protected by the DB unique constraint as a backstop).
    const existing = await pool.query(
      `SELECT id FROM entries WHERE email = $1 OR phone = $2 LIMIT 1`,
      [cleanEmail, cleanPhone]
    );

    if (existing.rows.length) {
      // Figure out which one collided so the message is accurate.
      const conflictCheck = await pool.query(
        `SELECT
           (SELECT COUNT(*) FROM entries WHERE email = $1) AS email_count,
           (SELECT COUNT(*) FROM entries WHERE phone = $2) AS phone_count`,
        [cleanEmail, cleanPhone]
      );
      const { email_count, phone_count } = conflictCheck.rows[0];
      const conflictErrors = [];
      if (Number(email_count) > 0) conflictErrors.push("An account with this email already exists.");
      if (Number(phone_count) > 0) conflictErrors.push("An account with this phone number already exists.");
      return res.status(409).json({ errors: conflictErrors });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO entries (name, email, phone, password_hash, birthday)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, birthday, created_at`,
      [name.trim(), cleanEmail, cleanPhone, passwordHash, birthday]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    // Backstop in case of a race condition between the check and the insert.
    if (err.code === "23505") {
      if (err.constraint && err.constraint.includes("phone")) {
        return res.status(409).json({ errors: ["An account with this phone number already exists."] });
      }
      return res.status(409).json({ errors: ["An account with this email already exists."] });
    }
    console.error("Error creating entry:", err);
    res.status(500).json({ errors: ["Something went wrong. Please try again."] });
  }
});

// GET /api/entries — list all submissions (used by the Dashboard)
app.get("/api/entries", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, birthday, created_at
       FROM entries
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching entries:", err);
    res.status(500).json({ errors: ["Something went wrong. Please try again."] });
  }
});
// POST /api/login — log in using email and password
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      errors: ["Email and password are required."],
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, birthday, password_hash, created_at
       FROM entries
       WHERE email = $1
       LIMIT 1`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        errors: ["Invalid email or password."],
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        errors: ["Invalid email or password."],
      });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      created_at: user.created_at,
    });
  } catch (err) {
    console.error("Login error:", err);

    res.status(500).json({
      errors: ["Something went wrong. Please try again."],
    });
  }
});

module.exports = app;