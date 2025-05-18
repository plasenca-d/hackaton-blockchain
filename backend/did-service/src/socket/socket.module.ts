import { Module } from "@nestjs/common";
import { SocketService } from "./services/socket.service";
import { SocketGateway } from "./socket.gateway";

@Module({
	providers: [SocketGateway, SocketService],
	exports: [SocketService],
})
export class SocketModule {}
