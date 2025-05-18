import { resolve } from "path";
import { type MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CONFIGS_LIST_FOR_LOAD } from "./configs";
import { EvalHttpsMiddleware } from "./eval-https/eval-https.middleware";
import { IssuerModule } from "./issuer/issuer.module";
import { CustomLoggerService } from "./logger/custom-logger.service";
import { LoggingInterceptor } from "./logger/logger.interceptor";
import { LoggerModule } from "./logger/logger.module";
import { SocketModule } from "./socket/socket.module";
// import { AppDataSource } from './database/app-data-source';
import { Verify } from "./verifier/entities/verify.entity";
import { VerifierModule } from "./verifier/verifier.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: CONFIGS_LIST_FOR_LOAD,
		}),
		LoggerModule,
		IssuerModule,
		TypeOrmModule.forRootAsync({
			// ...AppDataSource.options,
			// autoLoadEntities: true,
			useFactory: () => {
				return {
					type: "sqlite",
					database: resolve("database/app.db"),
					entities: [Verify],
					migrations: [
						resolve("dist/migrations/*.js"),
						resolve("./migrations/*.js"),
					],
					synchronize: false,
					logging: true,
					migrationsRun: true,
					autoLoadEntities: true,
				};
			},
			dataSourceFactory: async (options) => {
				const dataSource = await new DataSource(options!).initialize();
				console.log("Data Source has been initialized!");
				return dataSource;
			},
		}),
		AuthModule,
		VerifierModule,
		SocketModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		CustomLoggerService,
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		},
	],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(EvalHttpsMiddleware).forRoutes("");
	}
}
