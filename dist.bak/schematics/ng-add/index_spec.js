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
const testing_1 = require("@angular-devkit/schematics/testing");
const schema_1 = require("@schematics/angular/application/schema");
describe('Ng Add Schematic', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('schematics', require.resolve('../collection.json'));
    const defaultOptions = {
        project: 'bar',
        port: '4200',
        type: 'shell',
        minimal: false,
    };
    const workspaceOptions = {
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '6.0.0',
    };
    const appOptions = {
        name: 'bar',
        inlineStyle: false,
        inlineTemplate: false,
        routing: true,
        style: schema_1.Style.Css,
        skipTests: false,
        skipPackageJson: false,
    };
    let appTree;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        appTree = yield schematicRunner.runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions).toPromise();
        appTree = yield schematicRunner.runExternalSchematicAsync('@schematics/angular', 'application', appOptions, appTree).toPromise();
    }));
    it('should setup shell', () => __awaiter(void 0, void 0, void 0, function* () {
        const options = Object.assign({}, defaultOptions);
        const tree = yield schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();
        expect(tree.files).toContain('/projects/bar/src/app/micro-frontend-nav/micro-frontend-nav.component.css');
        expect(tree.files).toContain('/projects/bar/src/app/micro-frontend-nav/micro-frontend-nav.component.html');
        expect(tree.files).toContain('/projects/bar/src/app/micro-frontend-nav/micro-frontend-nav.component.spec.ts');
        expect(tree.files).toContain('/projects/bar/src/app/micro-frontend-nav/micro-frontend-nav.component.ts');
        expect(tree.files).toContain('/projects/bar/src/bootstrap.ts');
        expect(tree.files).toContain('/projects/bar/src/micro-frontends.ts');
        expect(tree.files).toContain('/projects/bar/webpack.config.js');
        expect(tree.files).toContain('/projects/bar/webpack.prod.config.js');
    }));
    it('should setup shell minimal', () => __awaiter(void 0, void 0, void 0, function* () {
        const options = Object.assign(Object.assign({}, defaultOptions), { minimal: true });
        const tree = yield schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();
        expect(tree.files).toContain('/projects/bar/src/bootstrap.ts');
        expect(tree.files).toContain('/projects/bar/src/micro-frontends.ts');
        expect(tree.files).toContain('/projects/bar/webpack.config.js');
        expect(tree.files).toContain('/projects/bar/webpack.prod.config.js');
        expect(tree.files).not.toContain('/projects/bar/src/app/micro-frontend-nav/micro-frontend-nav.component.css');
        expect(tree.files).not.toContain('/projects/bar/src/app/micro-frontend-nav/micro-frontend-nav.component.html');
        expect(tree.files).not.toContain('/projects/bar/src/app/micro-frontend-nav/micro-frontend-nav.component.spec.ts');
        expect(tree.files).not.toContain('/projects/bar/src/app/micro-frontend-nav/micro-frontend-nav.component.ts');
    }));
    it('should setup micro', () => __awaiter(void 0, void 0, void 0, function* () {
        const options = Object.assign(Object.assign({}, defaultOptions), { type: 'micro' });
        const tree = yield schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();
        expect(tree.files).toContain('/projects/bar/src/app/bar/bar-routing.module.ts');
        expect(tree.files).toContain('/projects/bar/src/app/bar/bar.component.html');
        expect(tree.files).toContain('/projects/bar/src/app/bar/bar.component.css');
        expect(tree.files).toContain('/projects/bar/src/app/bar/bar.component.spec.ts');
        expect(tree.files).toContain('/projects/bar/src/app/bar/bar.component.ts');
        expect(tree.files).toContain('/projects/bar/src/app/bar/bar.module.ts');
        expect(tree.files).toContain('/projects/bar/src/bootstrap.ts');
        expect(tree.files).toContain('/projects/bar/webpack.config.js');
        expect(tree.files).toContain('/projects/bar/webpack.prod.config.js');
    }));
    it('should setup micro minimal', () => __awaiter(void 0, void 0, void 0, function* () {
        const options = Object.assign(Object.assign({}, defaultOptions), { type: 'micro', minimal: true });
        const tree = yield schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();
        expect(tree.files).toContain('/projects/bar/src/bootstrap.ts');
        expect(tree.files).toContain('/projects/bar/webpack.config.js');
        expect(tree.files).toContain('/projects/bar/webpack.prod.config.js');
        expect(tree.files).not.toContain('/projects/bar/src/app/bar/bar-routing.module.ts');
        expect(tree.files).not.toContain('/projects/bar/src/app/bar/bar.component.html');
        expect(tree.files).not.toContain('/projects/bar/src/app/bar/bar.component.css');
        expect(tree.files).not.toContain('/projects/bar/src/app/bar/bar.component.spec.ts');
        expect(tree.files).not.toContain('/projects/bar/src/app/bar/bar.component.ts');
        expect(tree.files).not.toContain('/projects/bar/src/app/bar/bar.module.ts');
    }));
});
//# sourceMappingURL=index_spec.js.map