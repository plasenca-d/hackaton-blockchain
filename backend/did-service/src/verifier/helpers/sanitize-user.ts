import type { VerifyDto } from "../dtos/verify.dto";
import type { Verify } from "../entities";

export const sanitizeVerify = (user: Verify): VerifyDto => {
	const { email, ...sanitizedUser } = user;
	return sanitizedUser;
};
