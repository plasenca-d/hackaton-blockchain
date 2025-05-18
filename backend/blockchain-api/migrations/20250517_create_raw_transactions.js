exports.up = function (knex) {
  return knex.schema.createTable("raw_transactions", function (table) {
    // Primary key
    table.increments("id").primary();

    // Transaction identification
    table.string("transaction_hash").notNullable().unique();
    table.string("block_hash").notNullable();

    // Record details
    table.string("did1").notNullable().index();
    table.string("did2").notNullable().index();
    table.string("data_hash").notNullable();
    table.string("record_id").notNullable().unique().index();

    // Transaction metadata
    table.string("contract_id").notNullable();
    table.string("method_name").notNullable();
    table.string("status");
    table.bigInteger("gas_burnt");

    // Additional data
    table.jsonb("logs").defaultTo("[]");

    // URLs for exploration
    table.string("explorer_link");
    table.string("near_blocks_link");

    // Timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("blockchain_timestamp");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("raw_transactions");
};
