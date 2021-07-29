import { loadRemoteEntry, loadRemoteModule } from '@angular-architects/module-federation-runtime';
import { Data, Route } from '@angular/router';

export interface MicroFrontend {
  exposedModule?: string;
  moduleName?: string;
  remoteEntry: string;
  remoteName: string;
  routeData?: Data;
  routePath: string;
}

export const createMicroFrontendRoute = (mfe: MicroFrontend): Route => ({
  data: mfe.routeData ?? {},
  loadChildren: () => loadRemoteModule({
    remoteEntry: mfe.remoteEntry,
    remoteName: mfe.remoteName,
    exposedModule: mfe.exposedModule ?? './Module',
  }).then((m) => m[mfe.moduleName ?? 'MfeModule']),
  path: mfe.routePath,
});

export const createMicroFrontendRoutes = (mfes: MicroFrontend[]): Route[] => (
  mfes.map((mfe) => createMicroFrontendRoute(mfe))
);

export const loadMicroFrontendRemoteEntries = (mfes: MicroFrontend[]): Promise<void[]> => (
  Promise.all(mfes.map((mfe) => loadRemoteEntry(mfe.remoteEntry, mfe.remoteName)))
);
