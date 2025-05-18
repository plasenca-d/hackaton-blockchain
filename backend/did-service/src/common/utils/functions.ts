import { createHash } from "crypto";
import type { DIDResolver } from "@kaytrust/did-ethr";
import { NearDIDResolver } from "@kaytrust/did-near-resolver";
import type { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import type { ConfigEnvVars } from "src/configs";

export const concatRoutes = (...routes: string[]) => {
	return (
		"/" +
		routes
			.map((val) => (val + "").replace(/^\/+|\/+$/g, ""))
			.filter((route) => !!route.trim())
			.join("/")
	);
};

export function siteUrl(req: Request, ...routes: string[]) {
	const protocol = (req as ForceProtocolHttps<Request>).force_protocol_https
		? "https"
		: req.protocol;
	return `${protocol}://${req.host}` + concatRoutes(req.baseUrl, ...routes);
}

export function generarHash(texto: string, algoritmo = "sha256") {
	const hash = createHash(algoritmo);
	hash.update(texto);
	return hash.digest("hex");
}

export function getFormatterFromMessages<T>(errors: T) {
	return (errorCode: keyof T, ...args: string[]) => {
		const messageTemplate = errors[errorCode];
		return format(messageTemplate as string, ...args);
	};
}

export function getFormatterErrorMessages<T>(errors: T) {
	const cb = getFormatterFromMessages(errors);
	return (...args: Parameters<typeof cb>) => {
		return cb(...args) + " " + format("(%s)", args[0] as string);
	};
}

export function format(template: string, ...args: string[]): string {
	return template.replace(/%s/g, () => args.shift() || "");
}

export const getNearResolver = (
	configService: ConfigService<ConfigEnvVars, true>,
): Record<string, DIDResolver> => {
	const { nodeUrl, contractId, networkId } = configService.get("near", {
		infer: true,
	});
	const resolver = new NearDIDResolver(contractId, nodeUrl, networkId);
	return {
		near: async (did) => {
			const didDocument = await resolver.resolveDID(did);
			// const didDocument = await resolveNearDID(did, contractId);
			return {
				didDocument,
				didResolutionMetadata: { contentType: "application/did+json" },
				didDocumentMetadata: {},
			};
		},
	};
};
