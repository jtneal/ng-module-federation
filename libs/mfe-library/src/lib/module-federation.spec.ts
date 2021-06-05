import { lookupExposedModule } from './module-federation';

describe('Module Federation', () => {
  let remoteName: string;
  let exposedModule: string;

  beforeEach(() => {
    remoteName = 'remoteName';
    exposedModule = './Module';
  });

  it('should lookup exposed module', async () => {
    window[remoteName as any] = {
      get: () => Promise.resolve(() => true),
      init: () => Promise.resolve()
    } as any;

    expect(await lookupExposedModule<boolean>(remoteName, exposedModule)).toBeTruthy();
  });
});
