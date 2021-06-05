import { loadMicroFrontendRemoteEntries } from 'ng-module-federation';

import { microFrontends } from './micro-frontends';

loadMicroFrontendRemoteEntries(microFrontends)
  .catch(err => console.error('Error loading remote entries', err))
  .then(() => import('./bootstrap'))
  .catch(err => console.error(err));
