import { CredentialStatusTypes } from "@kaytrust/openid4vci";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

class CredentialSchema {
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

export class GenericDataSourceResponseDto {
	@ApiProperty({
		description: "Context needed to create the credential.",
		example: ["https://www.w3.org/2018/credentials/v1"],
		required: false,
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	context?: string[];

	@ApiProperty({
		description:
			"Key-value containing informtion about the credential subject. It is important that does not contain the 'id' property.",
		example: {
			degree: { type: "BachelorDegree", name: "Bachelor of Science and Arts" },
		},
		required: false,
	})
	@IsOptional()
	@IsObject()
	credentialSubject?: Record<string, any>;

	@ApiProperty({
		description: "Enum with the type of status.",
		example: "STATUS_LIST",
		required: true,
	})
	@IsNotEmpty()
	@IsEnum(CredentialStatusTypes)
	statusType: CredentialStatusTypes;

	@ApiProperty({
		description: "List of types of the credential data related to the schema.",
		example: ["VerifiableCredential", "DegreeCredential"],
		required: true,
	})
	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	types: string[];

	@ApiProperty({
		description:
			"Defines the structure of the verifiable credential, and the datatypes for the values of each property that appears.",
		example: {
			id: "https://example.org/examples/degree.json",
			type: "JsonSchemaValidator2018",
		},
		required: false,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CredentialSchema)
	credentialSchema?: CredentialSchema;

	@ApiProperty({
		description:
			"List of claims that will be added in a credential payload at the same level as 'credentialSubject'.",
		example: {
			displayParameter: {
				id: "urn:epass:displayParameter:1",
				type: "DisplayParameter",
				title: { en: "Certificate of Participation" },
			},
		},
		required: false,
	})
	@IsOptional()
	@IsObject()
	metadata?: Record<string, any>;

	/**
	 * @deprecated deprecated property use instead {@link GenericDataSourceResponseDto#validUntil}
	 */
	@ApiProperty({
		description:
			"Optional expiration date. Date format ISO (yyyy-MM-dd'T'HH:mm:ss'Z')",
		example: "2010-01-01T19:23:24Z",
		required: false,
		deprecated: true,
	})
	@IsOptional()
	@IsDateString()
	expirationDate?: string;

	@ApiProperty({
		description:
			"Optional date to help an issuer to express the date and time when a credential becomes valid. Date format ISO (yyyy-MM-dd'T'HH:mm:ss'Z')",
		example: "2010-01-01T19:23:24Z",
		required: false,
	})
	@IsOptional()
	@IsDateString()
	validFrom?: string;

	@ApiProperty({
		description:
			"Optional date to to express the date and time when a credential ceases to be valid. Date format ISO (yyyy-MM-dd'T'HH:mm:ss'Z')",
		example: "2010-01-01T19:23:24Z",
		required: false,
	})
	@IsOptional()
	@IsDateString()
	validUntil?: string;

	@ApiProperty({
		description:
			"Optional generation date. Date format ISO (yyyy-MM-dd'T'HH:mm:ss'Z')",
		example: "2010-01-01T19:23:24Z",
		required: false,
	})
	@IsOptional()
	@IsDateString()
	issued?: string;

	@ApiProperty({
		description: "Issuer DID",
		example: "did:ethr:0x....",
		required: false,
	})
	@IsOptional()
	@IsString()
	issuer?: string;
}
