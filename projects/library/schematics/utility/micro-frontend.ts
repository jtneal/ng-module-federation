import { normalize, strings } from '@angular-devkit/core';
import { chain, externalSchematic, Rule, Tree } from '@angular-devkit/schematics';

import { Application } from './applications';

export function addMicroFrontendConfiguration(applications: Application[], sourceRoot: string): Rule {
  return (host: Tree): Tree => {
    const configPath = normalize(`${sourceRoot}/micro-frontends.ts`);
    const configData = `import { MicroFrontend, MicroFrontendConfig } from 'ng-module-federation';

export const microFrontends: MicroFrontendConfig = {
  ${
    applications
      .map((a) => `${a.property}: new MicroFrontend('http://localhost:${a.port}/remoteEntry.js', '${a.dasherized}', '${a.dasherized}', '${a.classified}Module'),`)
      .join('\n  ')
  }
};
`;

    host.create(configPath, configData);

    return host;
  };
}

export function generateMicroFrontendEntryPoint(project: string, prefix: string): Rule {
  const dasherized = strings.dasherize(project);
  const moduleConfig = { name: dasherized, module: prefix, project, routing: true };
  const componentConfig = { name: dasherized, project };

  return chain([
    externalSchematic('@schematics/angular', 'module', moduleConfig),
    externalSchematic('@schematics/angular', 'component', componentConfig),
  ]);
}
