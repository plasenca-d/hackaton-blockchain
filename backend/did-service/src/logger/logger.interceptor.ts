import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import type { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import type { CustomLoggerService } from "./custom-logger.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly logger: CustomLoggerService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest();
		const method = req.method;
		const url = req.url;
		const now = Date.now();
		const controller = context.getClass().name;
		const handler = context.getHandler().name;

		const contextName = `${controller}/${handler}`;
		this.logger.setContext(contextName);

		this.logger.log(`${method} ${url} - Request started`);

		return next.handle().pipe(
			tap({
				next: (data) => {
					const responseTime = Date.now() - now;
					this.logger.log(`${method} ${url} - Response: ${responseTime}ms`);
				},
				error: (error) => {
					const responseTime = Date.now() - now;
					this.logger.error(
						`${method} ${url} - Error: ${error.message} - ${responseTime}ms`,
						error.stack,
					);
				},
			}),
		);
	}
}
