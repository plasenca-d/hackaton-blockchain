import { Test, type TestingModule } from "@nestjs/testing";
import { IssuerController } from "./issuer.controller";

describe("IssuerController", () => {
	let controller: IssuerController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [IssuerController],
		}).compile();

		controller = module.get<IssuerController>(IssuerController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
