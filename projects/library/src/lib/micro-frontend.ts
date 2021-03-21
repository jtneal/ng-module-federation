import { Route } from '@angular/router';

import { lookupExposedModule } from './module-federation';

export class MicroFrontend {
  public constructor(
    public remoteEntry: string,
    public remoteName: string,
    public route: string,
    public ngModuleName: string,
    public exposedModule = './Module',
  ) { }
}

export async function loadMicroFrontend<T = any>(microFrontend: MicroFrontend): Promise<T> {
  return lookupExposedModule<T>(
    microFrontend.remoteName,
    microFrontend.exposedModule,
  ).then((m) => m[microFrontend.ngModuleName]);
}

export function createMicroFrontendRoute(path: string, microFrontend: MicroFrontend): Route {
  return {
    loadChildren: () => loadMicroFrontend(microFrontend),
    path,
  };
}

export function createMicroFrontendDynamicRoute(microFrontend: MicroFrontend): Route {
  return createMicroFrontendRoute(microFrontend.route, microFrontend);
}
