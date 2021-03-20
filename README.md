[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=alert_status)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=security_rating)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=coverage)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)

# Angular Module Federation

A library for building run-time compilation micro frontends with Webpack 5 module federation using Angular.

## Table of Contents

- [Acknowledgement](#acknowledgement)
- [Webpack 5](#webpack-5)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Development](#development)
- [Contributing](#contributing)
- [Support + Feedback](#support--feedback)
- [License](#license)

## Acknowledgement

I must give credit where it is due. Most of this package is based on and inspired by `@angular-architects/module-federation` by [Manfred Steyer](https://twitter.com/ManfredSteyer). Manfred's package has lots of different options that you can choose from. However, I wanted to provide a more opinionated and concrete implementation that people who just want to get up and running quickly can try out.

## Webpack 5

Module federation requres Webpack 5, which in turn requires Angular 11+.

In order to use Webpack 5 with Angular, you must opt-in using **yarn**.

- Existing Projects: `ng config -g cli.packageManager yarn`
- New Projects: `ng new workspace-name --packageManager yarn`

Our installation process will take care of the rest, but for reference purposes, we will add this to your package.json:

```json
"resolutions": {
  "webpack": "^5.4.0"
}
```

Then we will run **yarn** to install all required packages.

Please note that Webpack 5 support is still considered experimental in Angular 11. According to the road map, it should be production ready with Angular 12, but I believe it will still require you to opt-in until at least Angular 13.

## Installation

This package works best on brand new projects. It will automatically build out a lot of scaffolding to enable you to try out a micro frontend architecture using module federation in mere seconds.

```sh
# Create your shell/container
ng new --routing --strict --style scss --packageManager yarn shell
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

Also, so far, all of this assumes all of your applications are in the same repo. However, that is not a hard requirement. The automation works best in monorepos, but can certainly be adapted to having separate repos for each application. In the future, I will provide example repos for both approaches.

## Getting Started



If you installed everything as described above without the minimal flag, you should now be ready to go.

```sh
npm start
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

export const microFrontends = {
  mfe1: new MicroFrontend('http://localhost:4210/remoteEntry.js', 'mfe1', 'mfe1', 'Mfe1Module'),
  mfe2: new MicroFrontend('http://localhost:4220/remoteEntry.js', 'mfe2', 'mfe2', 'Mfe2Module'),
  mfe3: new MicroFrontend('http://localhost:4230/remoteEntry.js', 'mfe3', 'mfe3', 'Mfe3Module'),
};

```

These values are dynamically pulled into your `main.ts` file and your `app-routing.module.ts` file.

### Minimal

If you did a minimal install, you'll have to do some configuration yourself. In your micro frontend applications, you'll need a module to use as your entrypoint that is NOT your AppModule. This module should have a router and a component that is defined for your root path, like so:

```typescript
// mfe1-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Mfe1Component } from './mfe1.component';

const routes: Routes = [{ component: Mfe1Component, path: '' }];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class Mfe1RoutingModule { }
```

```typescript
// mfe1.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Mfe1RoutingModule } from './mfe1-routing.module';
import { Mfe1Component } from './mfe1.component';

@NgModule({
  declarations: [Mfe1Component],
  imports: [
    CommonModule,
    Mfe1RoutingModule,
  ]
})
export class Mfe1Module { }
```

Then, in your shell, you'll need to define your routes that point to the micro frontends:

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { createMicroFrontendRoute } from 'ng-module-federation';

import { microFrontends } from '../micro-frontends';

const routes: Routes = [
  ...Object.keys(microFrontends).map((m) => createMicroFrontendDynamicRoute(microFrontends[m])),
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

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

If you want to use a headless browser, and generate coverage, use `npm run test:cov` instead.

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

If you want to use a headless browser, use `npm run e2e:ci` instead.

### Running the tester app

The workspace includes a tester application that can be used to test out features of the SDK. Run this using `ng serve tester` and browse to http://localhost:4200.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Contributing

We appreciate feedback and contribution to this repo! Feel free to submit a pull request and we will work with you to get it reviewed and merged.

## Support + Feedback

For support or to provide feedback, please [raise an issue on our issue tracker](https://github.com/jtneal/ng-module-federation/issues).

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/jtneal/ng-module-federation/blob/main/LICENSE) file for more info.
