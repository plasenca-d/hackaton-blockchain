import { ApiProperty } from "@nestjs/swagger";
import {
	IsDateString,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";
import { VerifiableCredentialDto } from "./verifiable-credential.model";

export class VerifiableCredentialV1Dto extends VerifiableCredentialDto {
	@ApiProperty({
		description:
			"Date-time string representing the date and time the credential becomes valid. Must be ISO format (yyyy-MM-dd'T'HH:mm:ss'Z')",
		example: "2010-01-01T19:23:24Z",
		required: true,
	})
	@IsNotEmpty({ message: "Field 'issuanceDate' cannot be null or blank." })
	@IsDateString()
	issuanceDate!: string;

	@ApiProperty({
		description:
			"Date-time string representing the date and time the credential becomes valid. Must be ISO format (yyyy-MM-dd'T'HH:mm:ss'Z')",
		example: "2010-01-01T19:23:24Z",
		required: false,
	})
	@IsOptional()
	@IsDateString()
	issued?: string;

	@ApiProperty({
		description:
			"Date-time representing the date and time the credential ceases to be valid. Must be ISO format (yyyy-MM-dd'T'HH:mm:ss'Z')",
		example: "2020-01-01T20:00:24Z",
		required: false,
	})
	@IsOptional()
	@IsDateString()
	expirationDate?: string;
}
