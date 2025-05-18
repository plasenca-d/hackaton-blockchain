import { Injectable, Logger } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import * as jwksRsa from "jwks-rsa";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { ConfigEnvVars } from "src/configs";
import type { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private readonly logger = new Logger(JwtStrategy.name);

	constructor(private configService: ConfigService<ConfigEnvVars>) {
		const JWKS_URI = configService.getOrThrow("JWKS_URI", { infer: true })!;
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKeyProvider: jwksRsa.passportJwtSecret({
				cache: true,
				rateLimit: true,
				jwksRequestsPerMinute: 5,
				jwksUri: JWKS_URI,
			}),
		});
		this.logger.log("JWKS_URI: " + JWKS_URI);
	}

	validate(payload: JwtPayload): JwtPayload {
		const email = payload.email ?? payload.sub;
		return { ...payload, email };
	}
}
