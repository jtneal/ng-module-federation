import { MicroFrontend } from 'projects/library/src/public-api';

export const microFrontends = {
  about: new MicroFrontend('http://localhost:4200/assets/examples/about/remoteEntry.js', 'about', 'about', 'AboutModule'),
  contact: new MicroFrontend('http://localhost:4200/assets/examples/contact/remoteEntry.js', 'contact', 'contact', 'ContactModule'),
  home: new MicroFrontend('http://localhost:4200/assets/examples/home/remoteEntry.js', 'home', 'home', 'HomeModule'),
};
