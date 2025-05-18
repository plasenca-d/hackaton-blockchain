import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SharedVpDto {
	@ApiProperty({
		required: false,
		description: "The name of the user",
		example: "John",
	})
	@IsString()
	@IsOptional()
	state: string;

	@ApiProperty({
		required: true,
		description: "The vpHash of the user",
		example: "$2a$10$abcdefghij1234567890",
	})
	@IsNotEmpty()
	@IsString()
	vp_token: string;
}
