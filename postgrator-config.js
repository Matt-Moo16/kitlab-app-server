require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": process.env.DATABASE_URL,
  //"sslmode": process.env.NODE_ENV === "production" ? "require" : "disable"
  "ssl": {
    "require": true,
    "rejectUnauthorized": false
  }
}