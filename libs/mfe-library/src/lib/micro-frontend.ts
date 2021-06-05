import { loadRemoteEntry } from '@angular-architects/module-federation-runtime';
import { NgModule } from '@angular/core';
import { Route } from '@angular/router';

import { lookupExposedModule } from './module-federation';

export interface MicroFrontend {
  exposedModule?: string;
  moduleName?: string;
  remoteEntry: string;
  remoteName: string;
  routePath: string;
}

export interface ModuleMap {
  [moduleName: string]: NgModule;
}

export async function loadMicroFrontend(mfe: MicroFrontend): Promise<NgModule> {
  const exposedModule = mfe.exposedModule ?? './Module';
  const moduleName = mfe.moduleName ?? 'MfeModule';

  return lookupExposedModule<ModuleMap>(mfe.remoteName, exposedModule).then((m) => m[moduleName]);
}

export function createMicroFrontendRoute(mfe: MicroFrontend): Route {
  return { loadChildren: () => loadMicroFrontend(mfe), path: mfe.routePath };
}

export function createMicroFrontendRoutes(mfes: MicroFrontend[]): Route[] {
  return mfes.map((mfe) => createMicroFrontendRoute(mfe));
}

export function loadMicroFrontendRemoteEntry(mfe: MicroFrontend): Promise<void> {
  return loadRemoteEntry(mfe.remoteEntry, mfe.remoteName);
}

export function loadMicroFrontendRemoteEntries(mfes: MicroFrontend[]): Promise<void[]> {
  return Promise.all(mfes.map((mfe) => loadMicroFrontendRemoteEntry(mfe)));
}
