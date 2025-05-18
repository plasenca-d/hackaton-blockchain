export interface JwtPayload {
	exp: number;
	iat: number;
	jti: string;
	iss: string;
	aud: string;
	sub: string;
	typ: string;
	azp: string;
	sid: string;
	acr: string;
	realm_access: {
		roles: Array<string>;
	};
	resource_access: {
		[key: string]: {
			roles: Array<string>;
		};
	};
	scope: string;
	email_verified: boolean;
	name: string;
	// kt: {
	//   campaign_id: string;
	// };
	preferred_username: string;
	given_name: string;
	family_name: string;
	email: string;
}
