import { Test, type TestingModule } from "@nestjs/testing";
import { VerifierController } from "./verifier.controller";

describe("VerifierController", () => {
	let controller: VerifierController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [VerifierController],
		}).compile();

		controller = module.get<VerifierController>(VerifierController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
