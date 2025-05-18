import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import type { CreateVerifyDto } from "./create-verify.dto";

export class VerifyDto implements Omit<CreateVerifyDto, "email"> {
	name: CreateVerifyDto["name"];
	did: CreateVerifyDto["did"];
	vpHash: CreateVerifyDto["vpHash"];
	verified: CreateVerifyDto["verified"];
}
