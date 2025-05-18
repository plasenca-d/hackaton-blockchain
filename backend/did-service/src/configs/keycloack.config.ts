export default () => {
	const { JWKS_URI } = process.env;

	if (!JWKS_URI) throw Error("Required env variable: JWKS_URI");

	return {
		JWKS_URI: JWKS_URI!,
	};
};
