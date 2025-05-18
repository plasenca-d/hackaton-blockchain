const express = require("express");
const { connect, KeyPair, keyStores } = require("near-api-js");
const cors = require("cors");
const path = require("path");
const knex = require("knex");
const config = require("./knexfile");

require("dotenv").config();

const environment = process.env.NODE_ENV || "development";
const db = knex(config[environment]);

// Database setup and operations
const dbOps = {
  /**
   * Initialize the database, run migrations if necessary
   */
  async init() {
    try {
      // Check if our table exists
      const exists = await db.schema.hasTable("raw_transactions");

      if (!exists) {
        console.log("Creating raw_transactions table...");
        await db.migrate.latest();
        console.log("Database migrations completed.");
      }

      const count = await db("raw_transactions").count("id as count").first();
      console.log(
        `Database connected. ${count.count} transactions in storage.`
      );
    } catch (err) {
      console.error("Database initialization error:", err);
      throw err;
    }
  },

  /**
   * Save a transaction to the database
   * @param {Object} transactionData - Data to save
   * @returns {Object} The saved transaction
   */
  async saveTransaction(transactionData) {
    try {
      // Make sure logs are properly serializable before storage
      let logsToStore;
      try {
        // Ensure logs can be properly serialized to JSON
        if (Array.isArray(transactionData.logs)) {
          // Convert any non-string elements to strings
          const sanitizedLogs = transactionData.logs.map((log) =>
            typeof log === "string" ? log : String(log)
          );
          logsToStore = JSON.stringify(sanitizedLogs);
        } else {
          // If logs is not an array, store an empty array
          logsToStore = "[]";
        }
      } catch (err) {
        console.warn(
          "Error serializing logs, using empty array instead:",
          err.message
        );
        logsToStore = "[]";
      }

      // Convert camelCase to snake_case for database columns
      const dbRecord = {
        transaction_hash: transactionData.transactionHash,
        block_hash: transactionData.blockHash,
        did1: transactionData.did1,
        did2: transactionData.did2,
        data_hash: transactionData.dataHash,
        record_id: transactionData.recordId,
        contract_id: transactionData.contractId,
        method_name: transactionData.methodName,
        status: transactionData.status,
        gas_burnt: transactionData.gasBurnt,
        logs: logsToStore,
        explorer_link: transactionData.explorerLink,
        near_blocks_link: transactionData.nearBlocksLink,
        blockchain_timestamp: transactionData.createdAt,
      };

      // Insert into database
      const results = await db("raw_transactions")
        .insert(dbRecord)
        .returning("id");

      // Extract actual ID value
      const id = results && results[0] ? results[0] : null;
      console.log(`Transaction saved with ID: ${id}`);

      return { id, ...transactionData };
    } catch (err) {
      console.error("Error saving transaction:", err);
      throw err;
    }
  },

  /**
   * Find transactions by various criteria
   * @param {Object} criteria - Search filters
   * @returns {Array} Matching transactions
   */
  async findTransactions(criteria) {
    try {
      // Build query based on criteria
      let query = db("raw_transactions");

      // Map camelCase criteria to snake_case column names
      if (criteria.recordId)
        query = query.where("record_id", criteria.recordId);
      if (criteria.did1) query = query.where("did1", criteria.did1);
      if (criteria.did2) query = query.where("did2", criteria.did2);
      if (criteria.transactionHash)
        query = query.where("transaction_hash", criteria.transactionHash);

      // Order by most recent first
      query = query.orderBy("created_at", "desc");

      // Execute query and return results
      const results = await query;

      // Convert results back to camelCase for API consistency
      return results.map((row) => {
        // Handle logs with safe parsing
        let parsedLogs = [];
        try {
          // Only attempt to parse if logs is a non-empty string
          if (row.logs && typeof row.logs === "string" && row.logs.trim()) {
            parsedLogs = JSON.parse(row.logs);
          }
        } catch (err) {
          console.warn(
            `Error parsing logs for record ${row.id}: ${err.message}`
          );
          // If the value can't be parsed as JSON, use it as a single log entry
          if (typeof row.logs === "string") {
            parsedLogs = [row.logs];
          }
        }

        return {
          id: row.id,
          transactionHash: row.transaction_hash,
          blockHash: row.block_hash,
          did1: row.did1,
          did2: row.did2,
          dataHash: row.data_hash,
          recordId: row.record_id,
          contractId: row.contract_id,
          methodName: row.method_name,
          status: row.status,
          gasBurnt: row.gas_burnt,
          logs: parsedLogs,
          explorerLink: row.explorer_link,
          nearBlocksLink: row.near_blocks_link,
          createdAt: row.created_at,
          blockchainTimestamp: row.blockchain_timestamp,
        };
      });
    } catch (err) {
      console.error("Error finding transactions:", err);
      throw err;
    }
  },
};

/**
 * Extracts relevant, non-sensitive data from a NEAR transaction outcome
 * @param {Object} outcome - The outcome from a NEAR transaction
 * @param {Object} metadata - Additional metadata about the transaction
 * @returns {Object} Structured data ready for database storage
 */
function extractTransactionData(outcome, metadata = {}) {
  return {
    // Transaction identification
    transactionHash: outcome.transaction.hash,
    blockHash: outcome.transaction_outcome.block_hash,

    // Transaction metadata
    createdAt: new Date().toISOString(),
    contractId: metadata.contractId || outcome.transaction.receiver_id,
    methodName: metadata.methodName || "",

    // Additional metadata passed in (like record details)
    ...metadata,

    // Transaction outcome details
    status: outcome.status.hasOwnProperty("SuccessValue")
      ? "SUCCESS"
      : "FAILURE",

    // Important logs if any
    logs: outcome.transaction_outcome.outcome.logs.concat(
      outcome.receipts_outcome.flatMap((r) => r.outcome.logs)
    ),

    // Gas usage statistics
    gasBurnt: outcome.transaction_outcome.outcome.gas_burnt,

    // Links for exploration
    explorerLink: `https://explorer.testnet.near.org/transactions/${outcome.transaction.hash}`,
    nearBlocksLink: `https://testnet.nearblocks.io/txns/${outcome.transaction.hash}`,
  };
}

const app = express();

app.use(cors());
app.use(express.json());

async function main() {
  // Initialize our database connection
  await dbOps.init();

  const keyStore = new keyStores.InMemoryKeyStore();
  const contractId = process.env.CONTRACT_ID;
  const privateKey = process.env.PRIVATE_KEY;

  if (!contractId || !privateKey) {
    console.error(
      "Missing environment variables: CONTRACT_ID and/or PRIVATE_KEY"
    );
    process.exit(1);
  }

  try {
    await keyStore.setKey(
      "testnet",
      contractId,
      KeyPair.fromString(privateKey)
    );

    const near = await connect({
      networkId: "testnet",
      keyStore,
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    });

    console.log(`Connected to NEAR testnet. Contract ID: ${contractId}`);

    const account = await near.account(contractId);

    try {
      await account.state();
      console.log(`Successfully connected to account ${contractId}`);
    } catch (error) {
      console.error(`Error accessing account ${contractId}:`, error.message);
      process.exit(1);
    }

    // Endpoint to retrieve transaction data by various criteria
    app.get("/transactions", async (req, res) => {
      try {
        // Extract query parameters for filtering
        const { recordId, did1, did2, transactionHash } = req.query;
        const criteria = {};

        // Build search criteria from query parameters
        if (recordId) criteria.recordId = recordId;
        if (did1) criteria.did1 = did1;
        if (did2) criteria.did2 = did2;
        if (transactionHash) criteria.transactionHash = transactionHash;

        // Find matching transactions
        const transactions = await dbOps.findTransactions(criteria);

        res.status(200).json({
          success: true,
          count: transactions.length,
          data: transactions,
        });
      } catch (error) {
        console.error("Error retrieving transactions:", error);
        res.status(500).json({ error: error.message });
      }
    });

    app.post("/add-record", async (req, res) => {
      const { did1, hash, did2 } = req.body;

      if (!did1 || !hash || !did2) {
        return res.status(400).json({
          error:
            "Missing required parameters: did1, hash, and did2 are required",
        });
      }

      try {
        const outcome = await account.functionCall({
          contractId,
          methodName: "add_record",
          args: { did1, hash, did2 },
          gas: "300000000000000",
        });

        // Extract the important data using our utility function
        const transactionData = extractTransactionData(outcome, {
          // Record-specific details
          did1,
          did2,
          dataHash: hash,
          contractId,
          methodName: "add_record",
          // Add a unique record ID that your other services can reference
          recordId: `${did1}-${did2}-${Date.now()}`,
        });

        // Save the transaction data to our Postgres database
        const savedTransaction = await dbOps.saveTransaction(transactionData);
        const transactionId =
          savedTransaction && savedTransaction.id
            ? savedTransaction.id
            : "unknown";
        console.log(
          `Transaction saved with ID: ${transactionId}, Record ID: ${transactionData.recordId}`
        );

        // Return both the saved data and (optionally) the full outcome
        res.status(200).json({
          success: true,
          data: transactionData,

          fullOutcome: outcome,
        });
      } catch (error) {
        console.error("Error calling contract:", error);
        res.status(500).json({ error: error.message });
      }
    });

    app.listen(3001, () => console.log("API running on port 3001"));
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
}

main();
