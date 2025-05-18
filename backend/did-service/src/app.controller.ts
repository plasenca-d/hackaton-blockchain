import { Controller, Get } from "@nestjs/common";
import type { AppService } from "./app.service";
import { Public } from "./auth/decorators/public-auth.decorator";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@Public()
	getHello(): string {
		return this.appService.getHello();
	}
}
