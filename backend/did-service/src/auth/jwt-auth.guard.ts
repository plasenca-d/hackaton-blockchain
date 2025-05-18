import {
	type ExecutionContext,
	Inject,
	Injectable,
	Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import {
	type Observable,
	type ObservableInput,
	from,
	isObservable,
	map,
} from "rxjs";
import { IS_PUBLIC_KEY } from "./decorators/public-auth.decorator";
import { ROLES_KEY } from "./decorators/roles.decorator";
import { Role } from "./enums/role.enum";
import type { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	private readonly logger = new Logger(JwtAuthGuard.name);

	@Inject(Reflector)
	private reflector: Reflector;

	convertirAObservable(
		respuesta: boolean | Promise<boolean> | Observable<boolean>,
	): Observable<boolean> {
		if (isObservable(respuesta)) {
			return respuesta;
		}
		return from<ObservableInput<boolean>>(
			respuesta as ObservableInput<boolean>,
		);
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}

		// this.logger.log(`prev super.canActivate`);

		const user_is_ok = Promise.resolve(super.canActivate(context))
			.then((result) => {
				return result;
			})
			.catch((error: Error) => {
				this.logger.error(error.message, error.stack);
				return false;
			});

		return from<ObservableInput<boolean>>(
			user_is_ok as ObservableInput<boolean>,
		).pipe(
			map((is_ok) => {
				// this.logger.log(`super.canActivate: user_is_ok=${is_ok}`);
				if (!is_ok) return false;
				const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
					ROLES_KEY,
					[context.getHandler(), context.getClass()],
				);
				if (!requiredRoles) {
					return true;
				}
				const req = context.switchToHttp().getRequest<Request>();
				const user: JwtPayload = req.user!;
				return (
					requiredRoles.includes(Role.User) ||
					(user.resource_access["demo_acme"]?.roles &&
						requiredRoles.some((role) =>
							user.resource_access["demo_acme"].roles.includes(role),
						))
				);
			}),
		);
	}
}
