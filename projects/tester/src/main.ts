import { loadRemoteEntry } from 'projects/library/src/public-api';

import { microFrontends } from './micro-frontends';

Promise.all([
  Object.keys(microFrontends).map((m) => loadRemoteEntry(microFrontends[m].remoteEntry, microFrontends[m].remoteName)),
])
  .catch((err) => console.error('Error loading remote entries', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
