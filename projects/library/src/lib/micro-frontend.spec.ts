import { createMicroFrontendDynamicRoute, createMicroFrontendRoute, loadMicroFrontend, MicroFrontend } from './micro-frontend';

describe('Micro Frontend', () => {
  let microFrontend: MicroFrontend;

  beforeEach(() => {
    microFrontend = { remoteEntry: 'remoteEntry', remoteName: 'remoteName', route: 'route', ngModuleName: 'ngModuleName' };
  });

  it('should create micro frontend', () => {
    expect(microFrontend.ngModuleName).toEqual('ngModuleName');
    expect(microFrontend.remoteEntry).toEqual('remoteEntry');
    expect(microFrontend.remoteName).toEqual('remoteName');
    expect(microFrontend.route).toEqual('route');
  });

  it('should load micro frontend', async () => {
    window[microFrontend.remoteName] = { get: () => Promise.resolve(() => ({ ngModuleName: true })) };

    expect(await loadMicroFrontend<boolean>(microFrontend)).toBeTruthy();
  });

  it('should load micro frontend with custom exposed module', async () => {
    window[microFrontend.remoteName] = { get: () => Promise.resolve(() => ({ ngModuleName: true })) };

    expect(await loadMicroFrontend<boolean>({ ...microFrontend, exposedModule: './Custom' })).toBeTruthy();
  });

  it('should create micro frontend route', async () => {
    window[microFrontend.remoteName] = { get: () => Promise.resolve(() => ({ ngModuleName: true })) };

    const route = createMicroFrontendRoute('path', microFrontend);

    expect(await (route as any).loadChildren()).toBeTruthy();
    expect(Object.keys(route)).toEqual(['loadChildren', 'path']);
  });

  it('should create micro frontend dynamic route', async () => {
    window[microFrontend.remoteName] = { get: () => Promise.resolve(() => ({ ngModuleName: true })) };

    const route = createMicroFrontendDynamicRoute(microFrontend);

    expect(await (route as any).loadChildren()).toBeTruthy();
    expect(Object.keys(route)).toEqual(['loadChildren', 'path']);
  });
});
