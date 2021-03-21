import { Route } from '@angular/router';
export declare class MicroFrontend {
    remoteEntry: string;
    remoteName: string;
    route: string;
    ngModuleName: string;
    exposedModule: string;
    constructor(remoteEntry: string, remoteName: string, route: string, ngModuleName: string, exposedModule?: string);
}
export declare function loadMicroFrontend<T = any>(microFrontend: MicroFrontend): Promise<T>;
export declare function createMicroFrontendRoute(path: string, microFrontend: MicroFrontend): Route;
export declare function createMicroFrontendDynamicRoute(microFrontend: MicroFrontend): Route;
