import { createMicroFrontendDynamicRoute, createMicroFrontendRoute, loadMicroFrontend, MicroFrontend } from './micro-frontend';

describe('Micro Frontend', () => {
  let microFrontend: MicroFrontend;

  beforeEach(() => {
    microFrontend = new MicroFrontend('remoteEntry', 'remoteName', 'route', 'ngModuleName');
  });

  it('should create micro frontend', () => {
    expect(microFrontend.exposedModule).toEqual('./Module');
    expect(microFrontend.ngModuleName).toEqual('ngModuleName');
    expect(microFrontend.remoteEntry).toEqual('remoteEntry');
    expect(microFrontend.remoteName).toEqual('remoteName');
    expect(microFrontend.route).toEqual('route');
  });

  it('should load micro frontend', async () => {
    window[microFrontend.remoteName] = { get: () => Promise.resolve(() => true) };

    expect(await loadMicroFrontend<boolean>(microFrontend)).toBeTruthy();
  });

  it('should create micro frontend route', () => {
    window[microFrontend.remoteName] = { get: () => Promise.resolve(() => true) };

    const route = createMicroFrontendRoute('path', microFrontend);

    expect((route as any).loadChildren()).toBeTruthy();
    expect(Object.keys(route)).toEqual(['loadChildren', 'path']);
  });

  it('should create micro frontend dynamic route', () => {
    window[microFrontend.remoteName] = { get: () => Promise.resolve(() => true) };

    const route = createMicroFrontendDynamicRoute(microFrontend);

    expect((route as any).loadChildren()).toBeTruthy();
    expect(Object.keys(route)).toEqual(['loadChildren', 'path']);
  });
});
