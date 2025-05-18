import type { VerifiableCredential } from "@kaytrust/openid4vci";
import { ApiProperty } from "@nestjs/swagger";
import { Type, instanceToPlain } from "class-transformer";
import {
	IsArray,
	IsDateString,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { CredentialSchemaDto } from "./credential-schema.model";

class CredentialStatusWrapper {
	[key: string]: any;
}

class TermsOfUseWrapper implements Record<string, any> {
	[key: string]: any;
}

export class VerifiableCredentialDto implements VerifiableCredential {
	@ApiProperty({
		description: "Key identifier to sign the credential",
		example: "0x00323242340",
		required: false,
	})
	@IsOptional()
	@IsString()
	signingKid?: string;

	@ApiProperty({
		description: "Credential context",
		example: "https://www.w3.org/2018/credentials/v1",
		required: false,
	})
	@IsOptional()
	@IsNotEmpty()
	"@context": VerifiableCredential["@context"];

	@ApiProperty({
		description: "Credential ID",
		example: "http://example.edu/credentials/3732",
		required: false,
	})
	@IsOptional()
	@IsString()
	id?: string;

	@ApiProperty({
		description: "Type of credentials.",
		example: '["VerifiableCredential", "UniversityDegreeCredential"]',
		required: true,
	})
	@IsNotEmpty({ message: "Field 'type' cannot be empty." })
	@IsArray()
	@IsString({ each: true })
	type!: string[];

	@ApiProperty({
		description: "Issuer of credential",
		example: "did:ebsi:z22rY6V7AVMR5LTMc1bdsNd6",
		required: true,
	})
	@IsNotEmpty({ message: "Field 'issuer' cannot be null or blank." })
	@IsString()
	issuer!: string;

	@ApiProperty({
		description: "Credential subject",
		example: '{ "id": "did:ebsi:zf42Mx1mLfncFW3ebwmQyhn" }',
		required: true,
	})
	@IsNotEmpty({ message: "Field 'credentialSubject' cannot be null or blank." })
	@IsObject()
	credentialSubject!: { id: any } & Record<string, any>;

	@ApiProperty({
		description: "DateTimeStamp when the credential becomes valid",
		example: "2010-01-01T19:23:24Z",
		required: false,
	})
	@IsOptional()
	@IsDateString()
	validFrom?: string;

	@ApiProperty({
		description: "Credential status",
		required: false,
	})
	@ValidateNested()
	@Type(() => CredentialStatusWrapper)
	credentialStatus?: VerifiableCredential["credentialStatus"];

	@ApiProperty({
		description: "Credential schema",
		required: false,
	})
	@ValidateNested()
	@Type(() => CredentialSchemaDto)
	credentialSchema?: CredentialSchemaDto;

	@ApiProperty({
		description: "Terms of use",
		required: false,
	})
	@ValidateNested()
	@Type(() => TermsOfUseWrapper)
	termsOfUse?: TermsOfUseWrapper;

	@ApiProperty({
		description: "Metadata claims in the credential",
		required: false,
	})
	@IsOptional()
	@IsObject()
	metadata?: Record<string, any>;
}

type a = keyof VerifiableCredentialDto;
