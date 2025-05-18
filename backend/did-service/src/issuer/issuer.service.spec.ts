import { Test, type TestingModule } from "@nestjs/testing";
import { IssuerService } from "./issuer.service";

describe("IssuerService", () => {
	let service: IssuerService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [IssuerService],
		}).compile();

		service = module.get<IssuerService>(IssuerService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
