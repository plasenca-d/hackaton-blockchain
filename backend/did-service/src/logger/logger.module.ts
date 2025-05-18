import * as path from "path";
import { Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import * as winston from "winston";

@Module({
	imports: [
		WinstonModule.forRoot({
			transports: [
				// Configuración para logs en consola
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.ms(),
						nestWinstonModuleUtilities.format.nestLike("Frutas", {
							colors: true,
							prettyPrint: true,
						}),
					),
				}),
				// Configuración para logs en archivo (ruta de Azure WebApp)
				new winston.transports.File({
					filename:
						process.env.NODE_ENV === "production"
							? "/home/LogFiles/Application/app.log"
							: path.join(process.cwd(), "logs", "app.log"),
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.json(),
					),
					maxsize: 10 * 1024 * 1024, // 10MB
					maxFiles: 5,
				}),
				// Configuración para logs de errores
				new winston.transports.File({
					filename:
						process.env.NODE_ENV === "production"
							? "/home/LogFiles/Application/error.log"
							: path.join(process.cwd(), "logs", "error.log"),
					level: "error",
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.json(),
					),
					maxsize: 10 * 1024 * 1024, // 10MB
					maxFiles: 5,
				}),
			],
		}),
	],
	exports: [WinstonModule],
})
export class LoggerModule {}
