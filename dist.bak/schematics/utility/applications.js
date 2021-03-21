"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportedApplications = void 0;
const core_1 = require("@angular-devkit/core");
const workspace_models_1 = require("@schematics/angular/utility/workspace-models");
function getSupportedApplications(workspace, project) {
    var _a, _b, _c;
    const applications = [];
    for (const [p, config] of workspace.projects) {
        if (p === project || config.extensions.projectType !== workspace_models_1.ProjectType.Application) {
            continue;
        }
        const application = {
            classified: core_1.strings.classify(p),
            dasherized: core_1.strings.dasherize(p),
            name: p,
            port: (_c = (_b = (_a = config.targets.get('serve')) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.port) !== null && _c !== void 0 ? _c : 4200,
        };
        if (application.dasherized.includes('-')) {
            application.accessor = `microFrontends['${application.dasherized}']`;
            application.property = `'${application.dasherized}'`;
        }
        else {
            application.accessor = `microFrontends.${application.dasherized}`;
            application.property = application.dasherized;
        }
        applications.push(application);
    }
    return applications;
}
exports.getSupportedApplications = getSupportedApplications;
//# sourceMappingURL=applications.js.map