import { ConfigService } from "@nestjs/config";
import { EvalHttpsMiddleware } from "./eval-https.middleware";

describe("EvalHttpsMiddleware", () => {
	it("should be defined", () => {
		expect(new EvalHttpsMiddleware(new ConfigService())).toBeDefined();
	});
});
