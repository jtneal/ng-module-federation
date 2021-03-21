import { __awaiter } from 'tslib';

const moduleMap = {};
const remoteMap = {};
let isDefaultScopeInitialized = false;
function loadRemoteEntry(remoteEntry, remoteName) {
    return new Promise((resolve, reject) => {
        // Is remoteEntry already loaded?
        if (moduleMap[remoteEntry]) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = remoteEntry;
        script.onerror = reject;
        script.onload = () => {
            initRemote(remoteName);
            moduleMap[remoteEntry] = true;
            resolve();
        };
        document.body.append(script);
    });
}
function initRemote(remoteName) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = window[remoteName];
        // Do we still need to initialize the remote?
        if (remoteMap[remoteName]) {
            return;
        }
        // Do we still need to initialize the share scope?
        if (!isDefaultScopeInitialized) {
            yield __webpack_init_sharing__('default');
            isDefaultScopeInitialized = true;
        }
        yield container.init(__webpack_share_scopes__.default);
        remoteMap[remoteName] = true;
        return container;
    });
}
function lookupExposedModule(remoteName, exposedModule) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = window[remoteName];
        const factory = yield container.get(exposedModule);
        const Module = factory();
        return Module;
    });
}

class MicroFrontend {
    constructor(remoteEntry, remoteName, route, ngModuleName, exposedModule = './Module') {
        this.remoteEntry = remoteEntry;
        this.remoteName = remoteName;
        this.route = route;
        this.ngModuleName = ngModuleName;
        this.exposedModule = exposedModule;
    }
}
function loadMicroFrontend(microFrontend) {
    return __awaiter(this, void 0, void 0, function* () {
        return lookupExposedModule(microFrontend.remoteName, microFrontend.exposedModule);
    });
}
function createMicroFrontendRoute(path, microFrontend) {
    return {
        loadChildren: () => loadMicroFrontend(microFrontend),
        path,
    };
}
function createMicroFrontendDynamicRoute(microFrontend) {
    return createMicroFrontendRoute(microFrontend.route, microFrontend);
}

/*
 * Public API Surface of library
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MicroFrontend, createMicroFrontendDynamicRoute, createMicroFrontendRoute, initRemote, loadMicroFrontend, loadRemoteEntry, lookupExposedModule };
//# sourceMappingURL=ng-module-federation.js.map
