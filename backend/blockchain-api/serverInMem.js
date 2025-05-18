const express = require("express");
const { connect, KeyPair, keyStores } = require("near-api-js");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

require("dotenv").config();

const db = {
  transactions: [],

  async init() {
    try {
      const data = await fs.readFile(
        path.join(__dirname, "transactions.json"),
        "utf8"
      );
      this.transactions = JSON.parse(data);
      console.log(
        `Loaded ${this.transactions.length} transactions from storage`
      );
    } catch (err) {
      // File might not exist yet, that's okay
      console.log("No transaction history found, starting fresh");
      this.transactions = [];
    }
    return this;
  },

  // Save a new transaction
  async saveTransaction(transactionData) {
    this.transactions.push(transactionData);
    await this.persist();
    return transactionData;
  },

  // Save transactions to disk
  async persist() {
    try {
      await fs.writeFile(
        path.join(__dirname, "transactions.json"),
        JSON.stringify(this.transactions, null, 2)
      );
    } catch (err) {
      console.error("Failed to persist transactions:", err);
    }
  },

  // Find transactions by various criteria
  findTransactions(criteria) {
    return this.transactions.filter((tx) => {
      for (const [key, value] of Object.entries(criteria)) {
        if (tx[key] !== value) return false;
      }
      return true;
    });
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
  await db.init();

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
    } // Endpoint to retrieve transaction data by various criteria
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
        const transactions =
          Object.keys(criteria).length > 0
            ? db.findTransactions(criteria)
            : db.transactions;

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

        // Save the transaction data to our database
        await db.saveTransaction(transactionData);
        console.log(`Transaction saved: ${transactionData.recordId}`);

        // Return both the saved data and (optionally) the full outcome
        res.status(200).json({
          success: true,
          data: transactionData,
          // Include the full outcome for development purposes
          // In production, you might want to remove this
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
