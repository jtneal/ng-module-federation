import { lookupExposedModule, initRemote, loadRemoteEntry } from './module-federation';

declare global {
  interface Window {
    __webpack_init_sharing__: (shareScope: string) => Promise<void>;
    __webpack_share_scopes__: { default: unknown };
  }
}

describe('Module Federation', () => {
  let remoteEntry: string;
  let remoteName: string;
  let exposedModule: string;

  beforeEach(() => {
    remoteEntry = 'remoteEntry';
    remoteName = 'remoteName';
    exposedModule = './Module';
  });

  it('should load remote entry', async () => {
    window[remoteName] = { init: () => Promise.resolve(() => true) };
    window.__webpack_init_sharing__ = () => Promise.resolve();
    window.__webpack_share_scopes__ = { default: 'default' };

    const mockElement = document.createElement('script');

    spyOn(document, 'createElement').and.returnValue(mockElement);
    spyOn(document.body, 'append').and.returnValue();

    loadRemoteEntry(remoteEntry, remoteName).then((response) => expect(response).toBeUndefined());

    mockElement.onload(new Event('load'));

    // Second load should pull from cache without onload
    expect(await loadRemoteEntry(remoteEntry, remoteName)).toBeUndefined();
  });

  it('should initialize remote', async () => {
    window[remoteName] = { init: () => Promise.resolve(() => true) };
    window[remoteEntry] = { init: () => Promise.resolve(() => true) };
    window.__webpack_init_sharing__ = () => Promise.resolve();
    window.__webpack_share_scopes__ = { default: 'default' };

    // First init should create
    expect(await initRemote(remoteName)).toEqual(window[remoteName]);

    // Second init should pull from cache
    expect(await initRemote(remoteName)).toEqual(window[remoteName]);

    // Third init for new module should create
    expect(await initRemote(remoteEntry)).toEqual(window[remoteEntry]);
  });

  it('should lookup exposed module', async () => {
    window[remoteName] = { get: () => Promise.resolve(() => true) };

    expect(await lookupExposedModule<boolean>(remoteName, exposedModule)).toBeTruthy();
  });
});
