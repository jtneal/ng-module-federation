"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRouteToShell = exports.addRouteToMicroFrontend = void 0;
const core_1 = require("@angular-devkit/core");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const find_module_1 = require("@schematics/angular/utility/find-module");
const ts = require("typescript");
const changes_1 = require("./changes");
function addRouteToMicroFrontend(sourceRoot, projectName) {
    return (host) => {
        var _a;
        const dasherized = core_1.strings.dasherize(projectName);
        const classified = core_1.strings.classify(`${projectName}Component`);
        const modulePath = core_1.normalize(`${sourceRoot}/app/${dasherized}/${dasherized}${find_module_1.ROUTING_MODULE_EXT}`);
        const source = ts.createSourceFile(modulePath, ((_a = host.read(modulePath)) === null || _a === void 0 ? void 0 : _a.toString()) || '', ts.ScriptTarget.Latest, true);
        const changes = [ast_utils_1.addImportToModule(source, modulePath, classified, `./${dasherized}.component`)[1]];
        changes.push(ast_utils_1.addRouteDeclarationToModule(source, modulePath, `{ component: ${classified}, path: '' }`));
        return changes_1.handleChanges(host, modulePath, changes);
    };
}
exports.addRouteToMicroFrontend = addRouteToMicroFrontend;
function addRouteToShell(sourceRoot) {
    return (host) => {
        var _a;
        const modulePath = core_1.normalize(`${sourceRoot}/app/app${find_module_1.ROUTING_MODULE_EXT}`);
        const source = ts.createSourceFile(modulePath, ((_a = host.read(modulePath)) === null || _a === void 0 ? void 0 : _a.toString()) || '', ts.ScriptTarget.Latest, true);
        const routes = '...Object.keys(microFrontends).map((m) => createMicroFrontendDynamicRoute(microFrontends[m])),';
        const changes = [
            ast_utils_1.addImportToModule(source, modulePath, 'createMicroFrontendDynamicRoute', 'ng-module-federation')[1],
            ast_utils_1.addImportToModule(source, modulePath, 'microFrontends', '../micro-frontends')[1],
            ast_utils_1.addRouteDeclarationToModule(source, modulePath, routes),
        ];
        return changes_1.handleChanges(host, modulePath, changes);
    };
}
exports.addRouteToShell = addRouteToShell;
//# sourceMappingURL=routes.js.map