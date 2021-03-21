"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMicroFrontendEntryPoint = exports.addMicroFrontendConfiguration = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
function addMicroFrontendConfiguration(applications, sourceRoot) {
    return (host) => {
        const configPath = core_1.normalize(`${sourceRoot}/micro-frontends.ts`);
        const configData = `import { MicroFrontend } from 'ng-module-federation';

export const microFrontends = {
  ${applications
            .map((a) => `${a.property}: new MicroFrontend('http://localhost:${a.port}/remoteEntry.js', '${a.dasherized}', '${a.dasherized}', '${a.classified}Module'),`)
            .join('\n  ')}
};
`;
        host.create(configPath, configData);
        return host;
    };
}
exports.addMicroFrontendConfiguration = addMicroFrontendConfiguration;
function generateMicroFrontendEntryPoint(project, prefix) {
    const dasherized = core_1.strings.dasherize(project);
    const moduleConfig = { name: dasherized, module: prefix, project, routing: true };
    const componentConfig = { name: dasherized, project };
    return schematics_1.chain([
        schematics_1.externalSchematic('@schematics/angular', 'module', moduleConfig),
        schematics_1.externalSchematic('@schematics/angular', 'component', componentConfig),
    ]);
}
exports.generateMicroFrontendEntryPoint = generateMicroFrontendEntryPoint;
//# sourceMappingURL=micro-frontend.js.map