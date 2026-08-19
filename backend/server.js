const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./authMiddleware");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;
function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

// Test backend
app.get("/", (req, res) => {
  res.send("URL Shortener Backend is Running!");
});

// Test database
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// Create short URL
app.post("/api/urls", authenticateToken, async (req, res) => {
  const originalUrl = req.body.originalUrl;
  const userId = req.user.userId;

  if (!originalUrl) {
    return res.status(400).json({
      message: "URL is required",
    });
  }
  let validUrl;

    try {
  validUrl = new URL(originalUrl);
} catch (error) {
  return res.status(400).json({
    message: "Invalid URL",
  });
}
if (validUrl.protocol !== "http:" && validUrl.protocol !== "https:") {
  return res.status(400).json({
    message: "Only HTTP and HTTPS URLs are allowed",
  });
}

  let shortCode;

while (true) {
  shortCode = generateShortCode();

  const existingUrl = await pool.query(
    "SELECT id FROM urls WHERE short_code = $1",
    [shortCode]
  );

  if (existingUrl.rows.length === 0) {
    break;
  }
}
//isert query
  try {
   const result = await pool.query(
  `INSERT INTO urls (original_url, short_code, user_id)
   VALUES ($1, $2, $3)
   RETURNING *`,
  [originalUrl, shortCode, userId]
);

    res.status(201).json({
      message: "URL created successfully",
      url: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create short URL",
    });
  }
});
//delete url
app.delete("/api/urls/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM urls WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    res.json({
      message: "URL deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete URL",
    });
  }
});
//get route
app.get("/api/urls", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT *
       FROM urls
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      urls: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch URLs",
    });
  }
});
// registration route
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email, and password are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});
//login route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});
// Redirect short URL
app.get("/:shortCode", async (req, res) => {
  const shortCode = req.params.shortCode;

  try {
    const result = await pool.query(
      "SELECT * FROM urls WHERE short_code = $1",
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Short URL not found");
    }

    const url = result.rows[0];

    await pool.query(
      "UPDATE urls SET click_count = click_count + 1 WHERE id = $1",
      [url.id]
    );

    res.redirect(url.original_url);
  } catch (error) {
    console.error(error);

    res.status(500).send("Server error");
  }
});

// Start server
app.listen(PORT, "localhost",() => {
  console.log(`Server running at http://localhost:${PORT}`);
});