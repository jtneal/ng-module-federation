import { normalize } from '@angular-devkit/core';
import { Rule, Tree } from '@angular-devkit/schematics';
import * as path from 'path';

/**
 * Convert the project to use asyncronous dynamic imports.
 * This is required for projects using the ModuleFederationPlugin.
 * Also updates the main script to dynamically load remote entries.
 * For more detailed information, checkout this article by Manfred Steyer:
 * https://www.angulararchitects.io/aktuelles/the-microfrontend-revolution-part-2-module-federation-with-angular
 */
export function updateBootstrap(isShell: boolean, main: string): Rule {
  return (host: Tree): Tree => {
    const bootstrapName = normalize(`${path.dirname(main)}/bootstrap.ts`);

    if (host.exists(bootstrapName)) {
      console.log(`${bootstrapName} already exists.`);

      return host;
    }

    let mainData = `import('./bootstrap')\n  .catch((err) => console.error(err));\n`;

    if (isShell) {
      mainData = `import { loadMicroFrontendRemoteEntries } from 'ng-module-federation';

import { microFrontends } from './micro-frontends';

loadMicroFrontendRemoteEntries(microFrontends)
  .catch((err) => console.error('Error loading remote entries', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
`;
    }

    host.rename(main, bootstrapName);
    host.create(main, mainData);

    return host;
  };
}
