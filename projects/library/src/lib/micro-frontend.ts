import { Route } from '@angular/router';

import { lookupExposedModule } from './module-federation';

export interface MicroFrontend {
  remoteEntry: string;
  remoteName: string;
  route: string;
  ngModuleName: string;
  exposedModule?: string;
}

export async function loadMicroFrontend<T = any>(microFrontend: MicroFrontend): Promise<T> {
  return lookupExposedModule<T>(
    microFrontend.remoteName,
    microFrontend.exposedModule ?? './Module',
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
