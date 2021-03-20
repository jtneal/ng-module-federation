import { strings, normalize } from '@angular-devkit/core';
import { Rule, Tree } from '@angular-devkit/schematics';
import { addImportToModule, addRouteDeclarationToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { ROUTING_MODULE_EXT } from '@schematics/angular/utility/find-module';
import * as ts from 'typescript';

import { handleChanges } from './changes';

export function addRouteToMicroFrontend(sourceRoot: string, projectName: string): Rule {
  return (host: Tree): Tree => {
    const dasherized = strings.dasherize(projectName);
    const classified = strings.classify(`${projectName}Component`);
    const modulePath = normalize(`${sourceRoot}/app/${dasherized}/${dasherized}${ROUTING_MODULE_EXT}`);
    const source = ts.createSourceFile(modulePath, host.read(modulePath)?.toString() || '', ts.ScriptTarget.Latest, true);
    const changes = [addImportToModule(source, modulePath, classified, `./${dasherized}.component`)[1]];

    changes.push(addRouteDeclarationToModule(
      source,
      modulePath,
      `{ component: ${classified}, path: '' }`,
    ) as InsertChange);

    return handleChanges(host, modulePath, changes);
  };
}

export function addRouteToShell(sourceRoot: string): Rule {
  return (host: Tree): Tree => {
    const modulePath = normalize(`${sourceRoot}/app/app${ROUTING_MODULE_EXT}`);
    const source = ts.createSourceFile(modulePath, host.read(modulePath)?.toString() || '', ts.ScriptTarget.Latest, true);
    const routes = '...Object.keys(microFrontends).map((m) => createMicroFrontendDynamicRoute(microFrontends[m])),';

    const changes = [
      addImportToModule(source, modulePath, 'createMicroFrontendDynamicRoute', 'ng-module-federation')[1],
      addImportToModule(source, modulePath, 'microFrontends', '../micro-frontends')[1],
      addRouteDeclarationToModule(source, modulePath, routes) as InsertChange,
    ];

    return handleChanges(host, modulePath, changes);
  };
}
