import { normalize } from '@angular-devkit/core';
import { chain, externalSchematic, Rule, Tree } from '@angular-devkit/schematics';

import { Application } from './applications';

export function addMicroFrontendConfiguration(applications: Application[], sourceRoot: string): Rule {
  return (host: Tree): Tree => {
    const configPath = normalize(`${sourceRoot}/micro-frontends.ts`);
    const configData = `import { MicroFrontend } from 'ng-module-federation';

export const microFrontends: MicroFrontend[] = [
  ${
    applications
      .map((a) => `{
    remoteEntry: 'http://localhost:${a.port}/remoteEntry.js',
    remoteName: '${a.dasherized}',
    routePath: '${a.dasherized}',
  },`)
      .join('\n  ')
  }
];
`;

    host.create(configPath, configData);

    return host;
  };
}

export function generateMicroFrontendEntryPoint(project: string, prefix: string): Rule {
  const moduleConfig = { flat: true, module: prefix, name: 'mfe', project, routing: true };
  const componentConfig = { module: 'mfe', name: project, project };

  return chain([
    externalSchematic('@schematics/angular', 'module', moduleConfig),
    externalSchematic('@schematics/angular', 'component', componentConfig),
  ]);
}
