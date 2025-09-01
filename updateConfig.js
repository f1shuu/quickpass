const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, './package.json');
const appConfigPath = path.resolve(__dirname, './app.config.js');

const packageJson = require(packageJsonPath);
const newVersion = packageJson.version;

let appConfig = fs.readFileSync(appConfigPath, 'utf-8');

appConfig = appConfig.replace(
    /version:\s*['"`][^'"`]+['"`]/,
    `version: '${newVersion}'`
);

fs.writeFileSync(appConfigPath, appConfig);

console.log(`Updated app.config.js version to ${newVersion}`);
