import { strings, normalize } from '@angular-devkit/core';
import { Rule, Tree } from '@angular-devkit/schematics';
import { addRouteDeclarationToModule, getSourceNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { ROUTING_MODULE_EXT } from '@schematics/angular/utility/find-module';
import * as ts from 'typescript';

import { insertAfterImports } from './ast';
import { handleChanges } from './changes';

export function addRouteToMicroFrontend(sourceRoot: string, projectName: string): Rule {
  return (host: Tree): Tree => {
    const dasherized = strings.dasherize(projectName);
    const classified = strings.classify(`${projectName}Component`);
    const modulePath = normalize(`${sourceRoot}/app/${dasherized}/${dasherized}${ROUTING_MODULE_EXT}`);
    const source = ts.createSourceFile(modulePath, host.read(modulePath)?.toString() || '', ts.ScriptTarget.Latest, true);
    const nodes = getSourceNodes(source);
    const route = `{ children: mfeRoutes, component: ${classified}, path: '' }`;
    const changes = [
      insertImport(source, modulePath, classified, `./${dasherized}.component`),
      insertAfterImports(nodes, modulePath, `const mfeRoutes: Routes = [];`),
      addRouteDeclarationToModule(source, modulePath, route) as InsertChange,
    ];

    return handleChanges(host, modulePath, changes);
  };
}

export function addRouteToShell(sourceRoot: string): Rule {
  return (host: Tree): Tree => {
    const modulePath = normalize(`${sourceRoot}/app/app${ROUTING_MODULE_EXT}`);
    const source = ts.createSourceFile(modulePath, host.read(modulePath)?.toString() || '', ts.ScriptTarget.Latest, true);
    const routes = '...microFrontends.map((m) => createMicroFrontendDynamicRoute(m))';

    const changes = [
      insertImport(source, modulePath, 'createMicroFrontendDynamicRoute', 'ng-module-federation'),
      insertImport(source, modulePath, 'microFrontends', '../micro-frontends'),
      addRouteDeclarationToModule(source, modulePath, routes) as InsertChange,
    ];

    return handleChanges(host, modulePath, changes);
  };
}
