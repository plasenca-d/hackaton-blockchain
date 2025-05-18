import didsConfig from "./dids.config";
import frontendConfig from "./frontend.config";
import keycloackConfig from "./keycloack.config";
import melonConfig from "./melon.config";
import openidConfig from "./openid.config";
import serverConfig from "./server.config";
import versionConfig from "./version.config";

export const CONFIGS_LIST_FOR_LOAD = [
	serverConfig,
	versionConfig,
	openidConfig,
	melonConfig,
	keycloackConfig,
	frontendConfig,
	didsConfig,
];

export type ConfigEnvVars = UnionToIntersection<
	ReturnType<(typeof CONFIGS_LIST_FOR_LOAD)[number]>
>;
