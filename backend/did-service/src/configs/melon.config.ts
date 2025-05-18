import { createDidEthr } from "@kaytrust/did-ethr";
import { createDidNearFromPrivateKey } from "@kaytrust/did-near";
import { Wallet } from "ethers";

export default () => {
	const {
		MELON_PRIVATE_KEY = Wallet.createRandom().privateKey,
		MELON_ETHR_DID,
		MELON_NEAR_DID,
		MELON_ISSUER_NAME,
		NETWORK_CHAIN_ID = 80002,
	} = process.env;

	console.log("MELON_PRIVATE_KEY", MELON_PRIVATE_KEY);

	if (!MELON_PRIVATE_KEY)
		throw Error("Required env variable: MELON_PRIVATE_KEY");

	let did = MELON_ETHR_DID;
	let did_near = MELON_NEAR_DID;

	if (!MELON_ETHR_DID) {
		const wallet = new Wallet(MELON_PRIVATE_KEY);
		const didEthr = createDidEthr(wallet.address, {
			chainNameOrId: NETWORK_CHAIN_ID,
		});
		did = didEthr.did;
	}
	if (!did_near) {
		did_near = createDidNearFromPrivateKey(MELON_PRIVATE_KEY);
		console.log("did_near", did_near);
	}

	return {
		MELON_PRIVATE_KEY: MELON_PRIVATE_KEY,
		MELON_ETHR_DID: did!,
		MELON_NEAR_DID: did_near!,
		MELON_ISSUER_NAME: MELON_ISSUER_NAME ?? "melon_university",
	};
};
