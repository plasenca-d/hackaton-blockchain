// Database configuration for different environments
require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "caseritos",
      charset: "utf8",
    },
    migrations: {
      directory: "./migrations",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./migrations",
    },
    pool: {
      min: 2,
      max: 10,
    },
    ssl: { rejectUnauthorized: false },
  },
};
