import { MicroFrontend } from 'ng-module-federation';

export const microFrontends: MicroFrontend[] = [
  {
    remoteEntry: '/assets/examples/about/remoteEntry.js',
    remoteName: 'about',
    routePath: 'about',
  },
  {
    remoteEntry: '/assets/examples/contact/remoteEntry.js',
    remoteName: 'contact',
    routePath: 'contact',
  },
  {
    remoteEntry: '/assets/examples/home/remoteEntry.js',
    remoteName: 'home',
    routePath: 'home',
  },
];
