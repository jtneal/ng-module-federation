"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDependencies = exports.addRequiredDependencies = exports.optInToWebpack5 = void 0;
const tasks_1 = require("@angular-devkit/schematics/tasks");
const dependencies_1 = require("@schematics/angular/utility/dependencies");
function optInToWebpack5() {
    return (host) => {
        dependencies_1.addPackageJsonDependency(host, {
            type: 'resolutions',
            name: 'webpack',
            version: '^5.4.0',
            overwrite: false,
        });
        return host;
    };
}
exports.optInToWebpack5 = optInToWebpack5;
function addRequiredDependencies(applications, project) {
    return (host) => {
        dependencies_1.addPackageJsonDependency(host, {
            type: 'scripts',
            name: 'start',
            version: 'run-p start:*',
            overwrite: true,
        });
        dependencies_1.addPackageJsonDependency(host, {
            type: 'scripts',
            name: 'prestart',
            version: 'ngcc',
            overwrite: false,
        });
        dependencies_1.addPackageJsonDependency(host, {
            type: dependencies_1.NodeDependencyType.Dev,
            name: 'npm-run-all',
            version: '^4.1.5',
            overwrite: false,
        });
        addProjectScript(host, project);
        applications.forEach((a) => addProjectScript(host, a.name));
        return host;
    };
}
exports.addRequiredDependencies = addRequiredDependencies;
function installDependencies() {
    return (host, context) => {
        context.addTask(new tasks_1.NodePackageInstallTask());
        return host;
    };
}
exports.installDependencies = installDependencies;
function addProjectScript(host, project) {
    dependencies_1.addPackageJsonDependency(host, {
        type: 'scripts',
        name: `start:${project}`,
        version: `ng serve --project ${project}`,
        overwrite: false,
    });
}
//# sourceMappingURL=dependencies.js.map