const { connect, KeyPair, keyStores } = require("near-api-js");

require("dotenv").config();

async function verifyKeyPair() {
  const contractId = process.env.CONTRACT_ID;
  const privateKey = process.env.PRIVATE_KEY;

  if (!contractId || !privateKey) {
    console.error(
      "Missing environment variables: CONTRACT_ID and/or PRIVATE_KEY"
    );
    process.exit(1);
  }

  console.log(`\nVerifying key pair for account: ${contractId}`);

  try {
    const keyPair = KeyPair.fromString(privateKey);
    const publicKey = keyPair.getPublicKey().toString();
    console.log(`Public key derived from private key: ${publicKey}`);

    const keyStore = new keyStores.InMemoryKeyStore();
    await keyStore.setKey("testnet", contractId, keyPair);

    const near = await connect({
      networkId: "testnet",
      keyStore,
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
    });

    try {
      const account = await near.account(contractId);
      const accountState = await account.state();
      console.log("\n✅ Success! Account access verified.");
      console.log(`Account ID: ${contractId}`);
      console.log(`Balance: ${accountState.amount} yoctoNEAR`);

      const accessKeys = await account.getAccessKeys();
      console.log("\nAccess Keys:");

      let keyFound = false;
      accessKeys.forEach((key) => {
        console.log(
          `- ${key.public_key}${
            key.public_key === publicKey ? " (current key)" : ""
          }`
        );
        if (key.public_key === publicKey) {
          keyFound = true;
        }
      });

      if (keyFound) {
        console.log("\n✅ Your current key is authorized for this account.");
      } else {
        console.log(
          "\n❌ Your current key is NOT in the authorized keys list for this account."
        );
        console.log("You need to add this key to your account using NEAR CLI:");
        console.log(
          `near add-key ${contractId} ${publicKey} --networkId testnet`
        );
      }
    } catch (error) {
      console.error(`\n❌ Error accessing account: ${error.message}`);
      console.log("\nPossible issues:");
      console.log(
        "1. The private key doesn't match any key authorized for this account"
      );
      console.log("2. The account doesn't exist on testnet");
      console.log("3. Network connectivity issues");
      console.log("\nSuggested steps:");
      console.log(
        "1. Generate a new key pair using 'node generate-keypair.js' and add it to your account"
      );
      console.log(
        "2. Update your .env file with the correct private key for this account"
      );
      console.log(
        "3. Check if the account exists on testnet using NEAR Explorer"
      );
    }
  } catch (error) {
    console.error(`\n❌ Key validation error: ${error.message}`);
  }
}

verifyKeyPair();
