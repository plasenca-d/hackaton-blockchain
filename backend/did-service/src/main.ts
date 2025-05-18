import * as fs from "fs";
import * as path from "path";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { AppModule } from "./app.module";
import type { ConfigEnvVars } from "./configs";
import { DEFAULT_APP_NAME } from "./configs/constants";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const configService = app.get(ConfigService<ConfigEnvVars, true>);

	app.enableCors({
		origin: configService.get("ORIGINS"),
	});

	if (!configService.getOrThrow("IS_PRODUCTION", { infer: true })) {
		const logDir = path.join(process.cwd(), "logs");
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir, { recursive: true });
		}
	}

	const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

	app.useLogger(logger);

	logger.log(
		"NODE_ENV: " + configService.getOrThrow("NODE_ENV", { infer: true }),
	);

	const OpenAPIOptions = new DocumentBuilder()
		.setTitle(DEFAULT_APP_NAME)
		.setDescription("Back: " + DEFAULT_APP_NAME)
		.setVersion(configService.get("APP_VERSION"))
		.build();

	const document = SwaggerModule.createDocument(app, OpenAPIOptions);
	SwaggerModule.setup("swagger-ui", app, document);

	await app.listen(configService.getOrThrow("PORT", { infer: true }));
}
bootstrap();
