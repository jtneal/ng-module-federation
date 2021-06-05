[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=alert_status)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=security_rating)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=coverage)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)

# Angular Module Federation

A library for building run-time compilation micro frontends with Webpack Module Federation using Angular.

## Table of Contents

- [Acknowledgement](#acknowledgement)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Development](#development)
- [Contributing](#contributing)
- [Support + Feedback](#support--feedback)
- [License](#license)

## Acknowledgement

I must give credit where it is due. Most of this package is based on and inspired by `@angular-architects/module-federation` by [Manfred Steyer](https://twitter.com/ManfredSteyer). Manfred's package has lots of different options that you can choose from. However, I wanted to provide a more opinionated and concrete implementation that people who just want to get up and running quickly can try out.

## Prerequisites

- Module Federation requires Webpack 5+
- Angular's support of Webpack 5 requires Angular 12+

## Installation

This package works best on brand new projects. It will automatically build out a lot of scaffolding to enable you to try out a micro frontend architecture using module federation in mere seconds.

```sh
# Create your shell/container
ng new --routing --style scss shell
cd shell

# Create your micro frontends
ng generate application --routing --style scss mfe1
ng generate application --routing --style scss mfe2
ng generate application --routing --style scss mfe3

# Add ng-module-federation to each project
ng add ng-module-federation --project mfe1 --type micro --port 4210
ng add ng-module-federation --project mfe2 --type micro --port 4220
ng add ng-module-federation --project mfe3 --type micro --port 4230
ng add ng-module-federation --project shell --type shell --port 4200
```

However, if you want to add this to an existing project - it is still possible. You can try out the `ng add` commands above, but they may conflict with some of your existing code. Instead, you can pass the minimal flag which will leave out most of the scaffolding we create around modules and components.

```sh
ng add ng-module-federation --project mfe1 --type micro --port 4210 --minimal
ng add ng-module-federation --project mfe2 --type micro --port 4220 --minimal
ng add ng-module-federation --project mfe3 --type micro --port 4230 --minimal
ng add ng-module-federation --project shell --type shell --port 4200 --minimal
```

Also, so far, all of this assumes all of your applications are in the same repo. However, that is not a hard requirement. The automation works best in monorepos, but can certainly be adapted to having separate repos for each application. If you want to see a demo of what this project would look like after running these commands, here's a demo I have created:

https://github.com/jtneal/ng-module-federation-demo

## Getting Started

If you installed everything as described above without the minimal flag, you should now be ready to go.

```sh
npm run run:all
```

This will start up all of your applications in parallel. If you followed my example above:

- Shell: http://localhost:4200
- MFE1: http://localhost:4210
- MFE2: http://localhost:4220
- MFE3: http://localhost:4230

As you can see, you can still run each micro frontend independently from the shell if you wish.

If you add more micro frontends in the future, you'll need to update your micro frontend configuration:

```typescript
// micro-frontends.ts
import { MicroFrontend } from 'ng-module-federation';

export const microFrontends: MicroFrontend[] = [
  {
    remoteEntry: 'http://localhost:4210/remoteEntry.js',
    remoteName: 'mfe1',
    routePath: 'mfe1',
  },
  {
    remoteEntry: 'http://localhost:4220/remoteEntry.js',
    remoteName: 'mfe2',
    routePath: 'mfe2',
  },
  {
    remoteEntry: 'http://localhost:4230/remoteEntry.js',
    remoteName: 'mfe3',
    routePath: 'mfe3',
  },
];
```

These values are dynamically pulled into your `main.ts` file and your `app-routing.module.ts` file.

### Minimal

If you did a minimal install, you'll have to do some configuration yourself. In your micro frontend applications, you'll need a module to use as your entrypoint that is NOT your AppModule. This module should have a router and a component that is defined for your root path, like so:

```typescript
// mfe-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Mfe1Component } from './mfe1.component';

const routes: Routes = [{ component: Mfe1Component, path: '' }];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class MfeRoutingModule { }
```

```typescript
// mfe.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MfeRoutingModule } from './mfe-routing.module';
import { Mfe1Component } from './mfe1/mfe1.component';

@NgModule({
  declarations: [Mfe1Component],
  imports: [
    CommonModule,
    MfeRoutingModule,
  ]
})
export class MfeModule { }
```

Then, in your shell, you'll need to define your routes that point to the micro frontends:

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { createMicroFrontendRoute } from 'ng-module-federation';

import { microFrontends } from '../micro-frontends';

const routes: Routes = [
  ...createMicroFrontendRoutes(microFrontends),
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
```

Lastly, simply create some navigation links that point to these routes:

```html
<nav>
  <ul>
    <li><a routerLink="/mfe1">MFE1</a></li>
    <li><a routerLink="/mfe2">MFE2</a></li>
    <li><a routerLink="/mfe3">MFE3</a></li>
  </ul>
</nav>
```

## Development

### Build

Run `npm run build` to build the project and schematics.

### Running unit tests

Run `npm run test` to execute the unit tests.

### Running schematics tests

Run `npm run test:schematics` to execute the schematics tests.

### Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests.

If you want to use a headless browser, use `npm run e2e:headless` instead.

### Running the tester app

The workspace includes a tester application that can be used to test out features of the SDK. Run this using `ng serve mfe-tester` and browse to http://localhost:4200.

## Contributing

We appreciate feedback and contribution to this repo! Feel free to submit a pull request and we will work with you to get it reviewed and merged.

## Support + Feedback

For support or to provide feedback, please [raise an issue on our issue tracker](https://github.com/jtneal/ng-module-federation/issues).

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/jtneal/ng-module-federation/blob/main/LICENSE) file for more info.
