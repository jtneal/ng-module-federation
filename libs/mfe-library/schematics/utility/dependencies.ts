import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';

export function updatePackageJson(): Rule {
  return (host: Tree): Tree => {
    addPackageJsonDependency(host, {
      type: 'scripts' as NodeDependencyType,
      name: 'run:all',
      version: 'node node_modules/@angular-architects/module-federation/src/server/mf-dev-server.js',
      overwrite: false,
    });

    addPackageJsonDependency(host, {
      type: NodeDependencyType.Default,
      name: '@angular-architects/module-federation',
      version: '^12.1.1',
      overwrite: false,
    });

    return host;
  };
}

export function installDependencies(): Rule {
  return (host: Tree, context: SchematicContext): Tree => {
    context.addTask(new NodePackageInstallTask());

    return host;
  };
}
