const knex = require("knex");
const config = require("./knexfile");
const path = require("path");
const fs = require("fs");

async function runMigrations() {
  console.log("Running database migrations...");

  const environment = process.env.NODE_ENV || "development";
  console.log(`Using environment: ${environment}`);

  try {
    const migrationsDir = path.join(__dirname, "migrations");
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir);
      console.log("Created migrations directory");
    }

    const db = knex(config[environment]);

    const result = await db.migrate.latest();
    console.log("Migration complete");
    console.log("Migrations run:", result[1]);

    const exists = await db.schema.hasTable("raw_transactions");
    console.log(`Table raw_transactions exists: ${exists}`);

    if (exists) {
      const count = await db("raw_transactions").count("id as count").first();
      console.log(`Number of transactions: ${count.count}`);
    }

    await db.destroy();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error during migration:", err);
    process.exit(1);
  }
}

runMigrations();
