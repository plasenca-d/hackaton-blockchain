import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateVerifyDto {
	@ApiProperty({
		required: true,
		description: "The name of the user",
		example: "John",
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		required: true,
		description: "The email address of the user",
		example: "example@example.com",
	})
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		required: true,
		description: "The did of the user",
		example: "did:ethr:0x...",
	})
	@IsString()
	@IsNotEmpty()
	did: string;

	@ApiProperty({
		required: true,
		description: "The vpHash of the user",
		example: "$2a$10$abcdefghij1234567890",
	})
	@IsNotEmpty()
	@IsString()
	vpHash: string;

	@ApiProperty({
		required: true,
		description: "The vpHash is verified",
		example: false,
	})
	verified: boolean;
}
