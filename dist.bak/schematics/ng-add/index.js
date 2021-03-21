"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ngAdd = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@schematics/angular/utility/workspace");
const workspace_models_1 = require("@schematics/angular/utility/workspace-models");
const applications_1 = require("../utility/applications");
const bootstrap_1 = require("../utility/bootstrap");
const dependencies_1 = require("../utility/dependencies");
const micro_frontend_1 = require("../utility/micro-frontend");
const nav_1 = require("../utility/nav");
const routes_1 = require("../utility/routes");
function ngAdd(options) {
    return (host) => __awaiter(this, void 0, void 0, function* () {
        const workspace = yield workspace_1.getWorkspace(host);
        if (!options.project) {
            options.project = workspace.extensions.defaultProject;
        }
        if (!options.project) {
            throw new schematics_1.SchematicsException('No default project found. Please specifiy a project name!');
        }
        const project = options.project;
        const config = workspace.projects.get(project);
        if (!config) {
            throw new schematics_1.SchematicsException(`Project ${project} not found!`);
        }
        if (config.extensions.projectType !== workspace_models_1.ProjectType.Application) {
            throw new schematics_1.SchematicsException(`Only projects of type "${workspace_models_1.ProjectType.Application}" are supported!`);
        }
        const port = parseInt(options.port, 10);
        if (isNaN(port)) {
            throw new schematics_1.SchematicsException('Port must be a number!');
        }
        const build = config.targets.get('build');
        if (!build) {
            throw new schematics_1.SchematicsException('Invalid application configuration: "build" not found!');
        }
        if (!build.options) {
            build.options = {};
        }
        if (!build.configurations) {
            build.configurations = { production: {} };
        }
        if (!build.configurations.production) {
            build.configurations.production = {};
        }
        const serve = config.targets.get('serve');
        if (!serve) {
            throw new schematics_1.SchematicsException('Invalid application configuration: "serve" not found!');
        }
        if (!serve.options) {
            serve.options = {};
        }
        if (!serve.configurations) {
            serve.configurations = { production: {} };
        }
        if (!serve.configurations.production) {
            serve.configurations.production = {};
        }
        const test = config.targets.get('test');
        if (!test) {
            throw new schematics_1.SchematicsException('Invalid application configuration: "test" not found!');
        }
        if (!test.options) {
            test.options = {};
        }
        const webpackPath = core_1.join(core_1.normalize(config.root), 'webpack.config.js');
        const webpackProdPath = core_1.join(core_1.normalize(config.root), 'webpack.prod.config.js');
        build.options.extraWebpackConfig = webpackPath;
        build.configurations.production.extraWebpackConfig = webpackProdPath;
        serve.options.extraWebpackConfig = webpackPath;
        serve.options.port = port;
        serve.configurations.production.extraWebpackConfig = webpackProdPath;
        test.options.extraWebpackConfig = webpackPath;
        const applications = applications_1.getSupportedApplications(workspace, project);
        const isShell = options.type === 'shell';
        const sourceRoot = config.sourceRoot;
        const templateSource = schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.applyTemplates(Object.assign(Object.assign({}, core_1.strings), { isShell, project, root: config.root })),
            schematics_1.move(core_1.normalize(config.root)),
        ]);
        const shellRules = [
            micro_frontend_1.addMicroFrontendConfiguration(applications, sourceRoot),
            dependencies_1.optInToWebpack5(),
            dependencies_1.addRequiredDependencies(applications, project),
            dependencies_1.installDependencies(),
        ];
        const microRules = [];
        if (!options.minimal) {
            shellRules.push(nav_1.addNavToShell(applications, sourceRoot, project), routes_1.addRouteToShell(sourceRoot));
            microRules.push(micro_frontend_1.generateMicroFrontendEntryPoint(project, config.prefix), routes_1.addRouteToMicroFrontend(sourceRoot, project));
        }
        return schematics_1.chain([
            workspace_1.updateWorkspace(workspace),
            schematics_1.mergeWith(templateSource),
            bootstrap_1.updateBootstrap(isShell, build.options.main),
            schematics_1.externalSchematic('ngx-build-plus', 'ng-add', { project: options.project }),
            schematics_1.chain(isShell ? shellRules : microRules),
        ]);
    });
}
exports.ngAdd = ngAdd;
//# sourceMappingURL=index.js.map