import { normalize, strings } from '@angular-devkit/core';
import { Rule, Tree } from '@angular-devkit/schematics';
import { addRouteDeclarationToModule, insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { ROUTING_MODULE_EXT } from '@schematics/angular/utility/find-module';
import * as ts from 'typescript';

import { handleChanges } from './changes';

export function addRouteToMicroFrontend(sourceRoot: string, projectName: string): Rule {
  return (host: Tree): Tree => {
    const dasherized = strings.dasherize(projectName);
    const classified = strings.classify(`${projectName}Component`);
    const modulePath = normalize(`${sourceRoot}/app/mfe${ROUTING_MODULE_EXT}`);
    const source = ts.createSourceFile(modulePath, host.read(modulePath)?.toString() || '', ts.ScriptTarget.Latest, true);
    const route = `{ component: ${classified}, path: '' }`;
    const changes = [
      insertImport(source, modulePath, classified, `./${dasherized}/${dasherized}.component`),
      addRouteDeclarationToModule(source, modulePath, route) as InsertChange,
    ];

    return handleChanges(host, modulePath, changes);
  };
}

export function addRouteToShell(sourceRoot: string): Rule {
  return (host: Tree): Tree => {
    let modulePath = normalize(`${sourceRoot}/app/app${ROUTING_MODULE_EXT}`);

    if (!host.exists(modulePath)) {
      modulePath = normalize(`${sourceRoot}/app/app.module.ts`);
    }

    const source = ts.createSourceFile(modulePath, host.read(modulePath)?.toString() || '', ts.ScriptTarget.Latest, true);
    const routes = '...createMicroFrontendRoutes(microFrontends)';

    const changes = [
      insertImport(source, modulePath, 'createMicroFrontendRoutes', 'ng-module-federation'),
      insertImport(source, modulePath, 'microFrontends', '../micro-frontends'),
      addRouteDeclarationToModule(source, modulePath, routes) as InsertChange,
    ];

    return handleChanges(host, modulePath, changes);
  };
}
