const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;
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
app.post("/api/urls", async (req, res) => {
  const originalUrl = req.body.originalUrl;

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

  try {
    const result = await pool.query(
      `INSERT INTO urls (original_url, short_code)
       VALUES ($1, $2)
       RETURNING *`,
      [originalUrl, shortCode]
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