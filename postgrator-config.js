require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": process.env.DATABASE_URL,
  "ssl": { "require": true, "rejectUnauthorized": false }
}