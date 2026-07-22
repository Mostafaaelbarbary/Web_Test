
const { Pool } = require("pg");
 
// Reads connection info from DATABASE_URL in your .env file, e.g.:
// DATABASE_URL=postgresql://username:password@localhost:5432/genz
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
 
pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
});
 
module.exports = pool;
 