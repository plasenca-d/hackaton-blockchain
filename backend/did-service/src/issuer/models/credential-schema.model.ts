import type { CredentialSchema } from "@kaytrust/openid4vci";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CredentialSchemaDto implements CredentialSchema {
	@ApiProperty({
		description: "URI identifying the schema file",
		example: "https://example.org/examples/degree.json",
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	id: string;

	@ApiProperty({
		description: "String identifying the schema type",
		example: "JsonSchemaValidator2018",
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	type: string;
}
