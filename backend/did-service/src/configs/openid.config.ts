export default () => {
	const { AUTHORIZATION_SERVER } = process.env;

	if (!AUTHORIZATION_SERVER)
		throw Error("Required env variable: AUTHORIZATION_SERVER");

	return {
		AUTHORIZATION_SERVER: AUTHORIZATION_SERVER,
	};
};
