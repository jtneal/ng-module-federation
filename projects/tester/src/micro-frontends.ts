import { MicroFrontend } from 'projects/library/src/public-api';

export const microFrontends: MicroFrontend[] = [
  {
    remoteEntry: 'http://localhost:4200/assets/examples/about/remoteEntry.js',
    remoteName: 'about',
    route: 'about',
    ngModuleName: 'AboutModule',
  },
  {
    remoteEntry: 'http://localhost:4200/assets/examples/contact/remoteEntry.js',
    remoteName: 'contact',
    route: 'contact',
    ngModuleName: 'ContactModule',
  },
  {
    remoteEntry: 'http://localhost:4200/assets/examples/home/remoteEntry.js',
    remoteName: 'home',
    route: 'home',
    ngModuleName: 'HomeModule',
  },
];
