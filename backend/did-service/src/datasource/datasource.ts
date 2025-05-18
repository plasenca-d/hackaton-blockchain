import { resolve } from "path";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
	type: "sqlite",
	database: resolve("database/app.db"),
	entities: [resolve("./**/*.entity.js")],
	migrations: [resolve("./migrations/*.js")],
	synchronize: false,
	logging: true,
	migrationsRun: true,
});

AppDataSource.initialize()
	.then(() => {
		console.log("Data Source has been initialized!");
	})
	.catch((err) => {
		console.error("Error during Data Source initialization", err);
	});
