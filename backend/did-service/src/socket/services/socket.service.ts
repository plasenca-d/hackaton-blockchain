import { Injectable, Logger } from "@nestjs/common";
import type { Socket } from "socket.io";
import type { VerifyDto } from "src/verifier/dtos/verify.dto";

@Injectable()
export class SocketService {
	private readonly connectedClients: Map<string, Socket> = new Map();
	private readonly logger = new Logger("SocketService");

	handleConnection(socket: Socket): void {
		const clientId = socket.id;
		this.connectedClients.set(clientId, socket);
		this.logger.log("conected: " + clientId);

		socket.on("disconnect", () => {
			this.connectedClients.delete(clientId);
		});

		// Handle other events and messages from the client
	}

	vpInserted(verify: VerifyDto) {
		this.connectedClients.forEach((socket) => {
			socket.emit("vp_inserted", verify);
		});
	}

	deleteAll() {
		this.connectedClients.clear();
	}

	delete(id: string) {
		// this.logger.log('disconected: ' + id)
		this.connectedClients.delete(id);
	}
}
