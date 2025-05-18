import { Logger } from "@nestjs/common";
import {
	type OnGatewayConnection,
	type OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import type { Socket } from "socket.io";
import type { SocketService } from "./services/socket.service";

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	private server: Socket;
	private readonly logger = new Logger("ChatGateway");

	async onModuleInit(): Promise<void> {
		this.logger.log("ChatGateway initialized");
		this.socketService.deleteAll();
	}

	constructor(private readonly socketService: SocketService) {}

	async handleDisconnect(socket: Socket) {
		this.socketService.delete(socket.id);
		this.logger.log(`Client disconnected: ${socket.id}`);
	}

	handleConnection(socket: Socket): void {
		this.socketService.handleConnection(socket);
		this.logger.log(`Client connected: ${socket.id}`);
	}

	// Implement other Socket.IO event handlers and message handlers
}
