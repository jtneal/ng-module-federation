"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNavToAppComponent = exports.updateNavTemplate = exports.addNavToShell = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
function addNavToShell(applications, sourceRoot, project) {
    return schematics_1.chain([
        schematics_1.externalSchematic('@schematics/angular', 'component', { name: 'micro-frontend-nav', project }),
        updateNavTemplate(applications, sourceRoot),
        addNavToAppComponent(sourceRoot),
    ]);
}
exports.addNavToShell = addNavToShell;
function updateNavTemplate(applications, sourceRoot) {
    return (host) => {
        const htmlPath = core_1.normalize(`${sourceRoot}/app/micro-frontend-nav/micro-frontend-nav.component.html`);
        const htmlData = `<nav>
  <ul>
    ${applications
            .map((a) => `<li><a routerLink="/${a.dasherized}">${a.classified}</a></li>`)
            .join('\n    ')}
  </ul>
</nav>
`;
        host.overwrite(htmlPath, htmlData);
        return host;
    };
}
exports.updateNavTemplate = updateNavTemplate;
function addNavToAppComponent(sourceRoot) {
    return (host) => {
        const find = '<router-outlet></router-outlet>';
        const replace = '<app-micro-frontend-nav></app-micro-frontend-nav>\n<router-outlet></router-outlet>';
        const htmlPath = core_1.normalize(`${sourceRoot}/app/app.component.html`);
        const htmlData = host.read(htmlPath) || find;
        host.overwrite(htmlPath, htmlData.toString().replace(find, replace));
        return host;
    };
}
exports.addNavToAppComponent = addNavToAppComponent;
//# sourceMappingURL=nav.js.map