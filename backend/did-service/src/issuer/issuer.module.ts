import { Module } from "@nestjs/common";
import { IssuerController } from "./issuer.controller";
import { IssuerService } from "./issuer.service";

@Module({
	controllers: [IssuerController],
	providers: [IssuerService],
})
export class IssuerModule {}
