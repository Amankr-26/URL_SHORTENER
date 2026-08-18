const { Pool } = require("pg");

const pool = new Pool({
  user: "aman",
  host: "localhost",
  database: "url_shortener",
  port: 5432,
});

module.exports = pool;