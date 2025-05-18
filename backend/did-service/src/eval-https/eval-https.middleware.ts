import { Injectable, type NestMiddleware } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import type { ConfigEnvVars } from "src/configs";

@Injectable()
export class EvalHttpsMiddleware implements NestMiddleware {
	constructor(private configService: ConfigService<ConfigEnvVars, true>) {}
	use(req: ForceProtocolHttps<Request>, res: any, next: () => void) {
		if (this.configService.get("FORCE_HTTPS")) {
			req.force_protocol_https = true;
		}
		next();
	}
}
