import { Test, type TestingModule } from "@nestjs/testing";
import { SocketService } from "./socket.service";

describe("SocketService", () => {
	let service: SocketService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SocketService],
		}).compile();

		service = module.get<SocketService>(SocketService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
