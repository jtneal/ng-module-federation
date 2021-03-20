import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';

import { Application } from './applications';

export function optInToWebpack5(): Rule {
  return (host: Tree): Tree => {
    addPackageJsonDependency(host, {
      type: 'resolutions' as any, // resolutions is not a valid NodeDependencyType
      name: 'webpack',
      version: '^5.4.0',
      overwrite: false,
    });

    return host;
  };
}

export function addRequiredDependencies(applications: Application[], project: string): Rule {
  return (host: Tree): Tree => {
    addPackageJsonDependency(host, {
      type: 'scripts' as any, // scripts is not a valid NodeDependencyType
      name: 'start',
      version: 'run-p start:*',
      overwrite: true,
    });

    addPackageJsonDependency(host, {
      type: 'scripts' as any, // scripts is not a valid NodeDependencyType
      name: 'prestart',
      version: 'ngcc',
      overwrite: false,
    });

    addPackageJsonDependency(host, {
      type: NodeDependencyType.Dev,
      name: 'npm-run-all',
      version: '^4.1.5',
      overwrite: false,
    });

    addProjectScript(host, project);
    applications.forEach((a) => addProjectScript(host, a.name));

    return host;
  };
}

export function installDependencies(): Rule {
  return (host: Tree, context: SchematicContext): Tree => {
    context.addTask(new NodePackageInstallTask());

    return host;
  };
}

function addProjectScript(host: Tree, project: string): void {
  addPackageJsonDependency(host, {
    type: 'scripts' as any, // scripts is not a valid NodeDependencyType
    name: `start:${project}`,
    version: `ng serve --project ${project}`,
    overwrite: false,
  });
}
