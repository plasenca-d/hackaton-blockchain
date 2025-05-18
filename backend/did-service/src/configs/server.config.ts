export default () => {
	const { PORT, ORIGINS, FORCE_HTTPS, NODE_ENV = "production" } = process.env;

	const ORIGINS_STR = ORIGINS ?? "";

	return {
		PORT: PORT ?? 3000,
		ORIGINS: ORIGINS_STR.split(",")
			.map((origin) => origin.trim())
			.filter((origin) => origin),
		NODE_ENV,
		IS_PRODUCTION: NODE_ENV === "production",
		FORCE_HTTPS: FORCE_HTTPS
			? FORCE_HTTPS.toLowerCase().trim() == "true" ||
				!!Number.parseInt(FORCE_HTTPS) ||
				(typeof FORCE_HTTPS == "boolean" && FORCE_HTTPS)
			: false,
	};
};
