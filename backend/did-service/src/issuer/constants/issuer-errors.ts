export const IssuerErrors = {
	E8091000: "Issuer '%s' not found.",
	E8091001:
		"Campaign with display name '%s', configuration id '%s' and issuer '%s' already exists.",
	E8091002: "Credential format '%s' is not supported with the provided types.",
	E8091003: "Internal server error. Exception: %s.",
	E8091004: "Suported format '%s' host not configured.",
	E8091005: "Request is not valid. %s",
	E8091006: "Could not find any issuer with did '%s'.",
	E8091007: "Issuer can't process credential format '%s'.",
	E8091008:
		"Could not find any supported credential configuration for issuer '%s'.",
	E8091009:
		"Data source service returned an error when requesting to metadata. Response: '%s'.",
	E8091010:
		"Issuer '%s' could not process the configuration id '%s' with grant type '%s'.",
	E8091011:
		"Credential configuration id '%s' needs a pre-authorized_code in order to create a credential offer.",
	E8091012: "Failed create the jwt. Exception: %s",
	E8091013: "Status list returned an error. Response: '%s'.",
	E8091014: "Issuance request has already been previously issued.",
	E8091015: "It is not possible issue VC yet.",
	E8091016: "Event type '%s' is not valid.",
	E8091017: "Event notification '%s' not found.",
	E8091018: "Internal error.",
	E8091019: "Credential could not be signed. Details: %s",
	E8091020: "Campaign with id '%s' not found.",
	E8091021: "Credential configuration '%s' is not supported.",
	E8091022: "Invalid authorization grant type '%s'.",
	E8091023:
		"Credential configuration with did '%s' and credential configuration id '%s' already exists.",
	E8091024:
		"User does not have read permissions to this credential configuration.",
	E8091025: "User does not have read permissions to this campaign.",
	E8091026: "Issuer '%s' already exists.",
	E8091027: "User does not have read permissions to this issuer.",
	E8091028: "User does not have update permissions to this issuer.",
	E8091029: "Unexpected error while encoding credentialOffer URI.",
	E8091030:
		"Key with kid '%s' not found in did '%s'. Maybe you don't have read permissions over the key or DID does not contain the provided key.",
	E8091031:
		"Provided campaign-id '%s' is not associated with credential-identifier '%s'.",
	E8091032: "Provided campaign-id '%s' is not owned by issuer '%s'.",
	E8091033:
		"User does not have update permissions to this credential configuration.",
	E8091034: "There was a problem deleting resource with id '%s'.",
	E8091035: "User does not have delete permissions to this campaign.",
	E8091036:
		"User does not have delete permissions to this credential configuration.",
	E8091037: "User does not have delete permissions to this issuer.",
	E8091038: "Campaign with id %s is not active.",
} as const;

export type IssuerErrorCode = keyof typeof IssuerErrors;
