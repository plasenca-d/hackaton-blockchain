export default () => {
	const { FRONTEND_BASE_URL } = process.env;

	return {
		FRONTEND_BASE_URL: FRONTEND_BASE_URL ?? "",
	};
};
