const fs = require("fs");
const packageJson = require("../package.json");

const version = packageJson.version;
const versionFileContent = `
export default () => ({
  APP_VERSION: "${version}"
})
`;

fs.writeFile("./src/configs/version.config.ts", versionFileContent, (err) => {
	if (err) {
		return console.log("Error escribiendo el archivo de versión:", err);
	}
	console.log("Archivo de versión generado correctamente");
});
