import { createMicroFrontendRoute, createMicroFrontendRoutes, loadMicroFrontendRemoteEntries, MicroFrontend } from './micro-frontend';

jest.mock('@angular-architects/module-federation-runtime', () => {
  const originalModule = jest.requireActual('@angular-architects/module-federation-runtime');

  return {
    ...originalModule,
    loadRemoteModule: jest.fn().mockReturnValue(Promise.resolve({ MfeModule: true })),
  }
});

describe('Micro Frontend', () => {
  let microFrontend: MicroFrontend;

  beforeEach(() => {
    microFrontend = {
      remoteEntry: 'remoteEntry',
      remoteName: 'remoteName',
      routePath: 'route',
    };

    window[microFrontend.remoteName as any] = {
      get: () => Promise.resolve(() => ({ CustomModule: true, MfeModule: true })),
      init: () => Promise.resolve(),
    } as any;

    window['__webpack_init_sharing__' as any] = (() => Promise.resolve()) as any;
    window['__webpack_share_scopes__' as any] = { default: 'default' } as any;
  });

  it('should create micro frontend route', async () => {
    const route = createMicroFrontendRoute(microFrontend);
    const loadChildren = route.loadChildren as CallableFunction;

    expect(await loadChildren()).toBeTruthy();
    expect(Object.keys(route)).toEqual(['loadChildren', 'path']);
  });

  it('should create micro frontend route without defaults', async () => {
    const route = createMicroFrontendRoute({ ...microFrontend, exposedModule: './Module', moduleName: 'MfeModule' });
    const loadChildren = route.loadChildren as CallableFunction;

    expect(await loadChildren()).toBeTruthy();
    expect(Object.keys(route)).toEqual(['loadChildren', 'path']);
  });

  it('should create micro frontend routes', () => {
    const routes = createMicroFrontendRoutes([microFrontend]);

    routes.forEach(async (route) => {
      const loadChildren = route.loadChildren as CallableFunction;

      expect(await loadChildren()).toBeTruthy();
      expect(Object.keys(route)).toEqual(['loadChildren', 'path']);
    });
  });

  it('should load micro frontend remote entries', async () => {
    const mockElement = document.createElement('script');

    jest.spyOn(document, 'createElement').mockImplementation(() => mockElement);
    jest.spyOn(document.body, 'appendChild').mockImplementation(() => mockElement);

    loadMicroFrontendRemoteEntries([microFrontend]).then((response) => expect(response).toEqual([undefined]));

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    mockElement.onload!(new Event('load'));

    // Second load should pull from cache without onload
    expect(await loadMicroFrontendRemoteEntries([microFrontend])).toEqual([undefined]);
  });
});
