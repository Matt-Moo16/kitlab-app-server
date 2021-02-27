require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": process.env.DATABASE_URL + "?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory",
  //"sslmode": process.env.NODE_ENV === "production" ? "require" : "disable"
  "ssl": {
    "require": true,
    "rejectUnauthorized": false
  }
}