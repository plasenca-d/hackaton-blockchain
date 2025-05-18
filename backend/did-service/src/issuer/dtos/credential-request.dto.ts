import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import type { CredentialRequestValidation } from "./credential-request-validation.dto";

export class ProofObject {
	@ApiProperty({
		required: true,
		description: "Proof type",
		example: "jwt",
	})
	@IsNotEmpty()
	@IsString()
	proof_type: string;

	@ApiProperty({
		required: true,
		description: "JWT with the proof",
		example: "eyJra...OzM",
	})
	@IsNotEmpty({ message: "Field 'jwt' cannot be null or blank." })
	@IsString()
	jwt: string;
}

export class ProofsObject {
	@ApiProperty({
		required: true,
		description: "JWT with the proof",
		example: ["eyJra...OzM"],
	})
	@IsArray()
	@IsString({ each: true })
	jwt: string[];
}

export class CredentialRequestDto {
	@ApiProperty({
		required: false,
		description:
			"(draft 13+) REQUIRED when an Authorization Details of type openid_credential was " +
			"returned from the Token Response. It MUST NOT be used otherwise. A string " +
			"that identifies a Credential Dataset that is requested for issuance. When " +
			"this parameter is used, the credential_configuration_id MUST NOT be present.",
		example: "VerifiableAuthorisationToOnboard",
	})
	@IsOptional()
	@IsString()
	credential_identifier: string;

	@ApiProperty({
		required: false,
		description:
			"(draft 13+) REQUIRED if a credential_identifiers parameter was not returned " +
			"from the Token Response as part of the authorization_details parameter. " +
			"It MUST NOT be used otherwise. String that uniquely identifies one of " +
			"the keys in the name/value pairs stored in the credential_configurations_supported " +
			"Credential Issuer metadata. The corresponding object in the " +
			"credential_configurations_supported map MUST contain one of the " +
			"value(s) used in the scope parameter in the Authorization Request. " +
			"When this parameter is used, the credential_identifier MUST NOT be present.",
		example: "VerifiableAuthorisationToOnboard",
	})
	@IsOptional()
	@IsString()
	credential_configuration_id: string;

	@ApiProperty({
		required: false,
		description:
			"(draft10 & draft11) REQUIRED. Format of the Credential to be issued. This Credential " +
			"format identifier determines further parameters required to determine the type and " +
			"(optionally) the content of the credential to be issued. It is not necessary if using " +
			"credential_configuration_id or credential_identifier for draft 13+.",
		example: "jwt_vc",
	})
	@IsOptional()
	@IsString()
	format: string;

	@ApiProperty({
		required: false,
		description:
			"List of string containing credential types to issue. It is not necessary if using " +
			"credential_configuration_id or credential_identifier for draft 13+.",
		example: ["VerifiableCredential", "UniversityDegreeCredential"],
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	types: string[];

	@ApiProperty({
		required: true,
		description:
			"Object providing a single proof of possession of the cryptographic " +
			"key material to which the issued Credential instance will be bound to " +
			"proof parameter MUST NOT be present if proofs parameter is used.",
	})
	@ValidateNested()
	@Type(() => ProofObject)
	proof: ProofObject;

	@ApiProperty({
		required: false,
		description:
			"Not supported. Object providing one or more proof of possessions of the " +
			"cryptographic key material to which the issued Credential instances " +
			"will be bound to. The proofs parameter MUST NOT be present if proof " +
			"parameter is used.",
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => ProofsObject)
	proofs: ProofsObject;

	isValid(xCorrelationId: string): CredentialRequestValidation {
		let isValid = true;
		const messageBuilder: string[] = []; // Use an array for easier joining

		const {
			credential_identifier,
			credential_configuration_id,
			types,
			format,
			proof,
			proofs,
		} = this;

		const isCredentialIdentifierEmpty = !credential_identifier;
		const isCredentialConfigEmpty = !credential_configuration_id;
		const isTypesEmpty = !types || types.length === 0;
		const isFormatEmpty = !format;
		const isProofEmpty = !proof;
		const isProofsEmpty = !proofs || proofs.jwt.length === 0;

		// Validation 1: All fields are null or empty
		if (
			isCredentialIdentifierEmpty &&
			isCredentialConfigEmpty &&
			isTypesEmpty &&
			isFormatEmpty
		) {
			isValid = false;
			messageBuilder.push(
				"Request fields 'credential_identifier', 'credential_configuration_id', 'types' and 'format' are null or empty.",
			);
		}

		// Validation 2: credential_configuration_id && credential_identifier both fields are not null
		if (!isCredentialIdentifierEmpty && !isCredentialConfigEmpty) {
			isValid = false;
			messageBuilder.push(
				"Request fields 'credential_identifier' and 'credential_configuration_id' cannot all be non-null simultaneously. Only 'credential_configuration_id' or 'credential_identifier' are accepted as non-null.",
			);
		}

		// Validation 3: If 'credentialConfigurationId' is null, 'types' and 'format' must be present
		if (
			isCredentialIdentifierEmpty &&
			isCredentialConfigEmpty &&
			(isTypesEmpty || isFormatEmpty)
		) {
			isValid = false;
			messageBuilder.push(
				"Request fields 'types' and 'format' cannot be null if 'credential_configuration_id' and 'credential_identifier' are null.",
			);
		}

		// Validation 5: Check if proof and proofs are not null simultaneously
		if (!isProofEmpty && !isProofsEmpty) {
			isValid = false;
			messageBuilder.push(
				"Request fields 'proof' and 'proofs' cannot all be non-null simultaneously. Only one is accepted as non-null.",
			);
		}

		// Validate 6: Check if proofs is not null, not supported for the moment.
		if (!isProofsEmpty) {
			isValid = false;
			messageBuilder.push("Request fields 'proofs' not supported.");
		}

		// Validation 7: Check if proof not empty, proof_type must be 'jwt'
		if (!isProofEmpty && proof?.proof_type !== "jwt") {
			isValid = false;
			messageBuilder.push(
				"Request field 'proof' must contain 'proof_type' as 'jwt'.",
			);
		}

		return { isValid, message: messageBuilder.join(" ").trim() };
	}
}
