const { KeyPair } = require("near-api-js");
const fs = require("fs");
require("dotenv").config();

const keyPair = KeyPair.fromRandom("ed25519");
const publicKey = keyPair.getPublicKey().toString();
const privateKey = keyPair.toString("hex");

console.log("\n=== New Key Pair Generated ===");
console.log(`Public Key: ${publicKey}`);
console.log(`Private Key: ${privateKey}`);
console.log("\n=== Instructions ===");
console.log(
	"1. Add this key to your NEAR account using the NEAR CLI or web wallet:",
);
console.log(`   near login`);
console.log(
	`   near add-key ${process.env.CONTRACT_ID} ${publicKey} --networkId testnet`,
);
console.log(
	"\n2. Or update your .env file with the current private key associated with your account.\n",
);

const keyData = {
	accountId: process.env.CONTRACT_ID,
	publicKey,
	privateKey,
};

fs.writeFileSync("keypair-info.json", JSON.stringify(keyData, null, 2));
console.log("Key information has been saved to 'keypair-info.json'");
