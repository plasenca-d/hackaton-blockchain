import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SocketModule } from "src/socket/socket.module";
import { Verify } from "./entities/verify.entity";
import { VerifierController } from "./verifier.controller";
import { VerifierService } from "./verifier.service";

@Module({
	imports: [TypeOrmModule.forFeature([Verify]), SocketModule],
	controllers: [VerifierController],
	providers: [VerifierService],
})
export class VerifierModule {}
