[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=alert_status)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=security_rating)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=jtneal_ng-module-federation&metric=coverage)](https://sonarcloud.io/dashboard?id=jtneal_ng-module-federation)


# Angular Module Federation

一个用于使用Angular的Webpack模块联邦构建运行时编译微的前端的库。

---

[English](./README.md) | [中文文档](./README_ZH.md)

---

## 目录

- [鸣谢](#鸣谢)
- [先决条件](#先决条件)
- [安装](#安装)
- [入门指南](#入门指南)
- [开发](#开发)
- [Contributing](#contributing)
- [Support + Feedback](#support--feedback)
- [License](#license)

## 鸣谢

我必须把功劳归于它。这个包的大部分内容都是基于[Manfred Steyer](https://twitter.com/ManfredSteyer)的`@angular-architects/module-federation` 并受其启发。Manfred的包有很多不同的选项，你可以从中选择。然而，我想提供一个更有主见的具体实现，让那些只想快速启动和运行的人可以试试。

## 先决条件

- 模块联邦的使用，需要Webpack5以上的版本
- Angular对Webpack5的支持，需要在12以上的版本

## 安装

这个包在全新的项目中效果最好。它将自动构建大量的脚手架，使你能够在短短几秒钟内尝试使用模块联邦的微型前端架构。

```sh
# 创建你的壳应用/容器应用
ng new --routing --style scss shell
cd shell

# 创建你的微前端应用
ng generate application --routing --style scss mfe1
ng generate application --routing --style scss mfe2
ng generate application --routing --style scss mfe3

# 添加模块联邦到每个应用
ng add ng-module-federation --project mfe1 --type micro --port 4210
ng add ng-module-federation --project mfe2 --type micro --port 4220
ng add ng-module-federation --project mfe3 --type micro --port 4230
ng add ng-module-federation --project shell --type shell --port 4200
```

然而，如果你想把它添加到一个现有的项目中--这仍然是可能的。你可以试试上面的`ng add`命令，但它们可能与你现有的一些代码冲突。相反，你可以通过最小标志(minimal flag)，这将省去我们围绕模块和组件创建的大部分脚手架。

```sh
ng add ng-module-federation --project mfe1 --type micro --port 4210 --minimal
ng add ng-module-federation --project mfe2 --type micro --port 4220 --minimal
ng add ng-module-federation --project mfe3 --type micro --port 4230 --minimal
ng add ng-module-federation --project shell --type shell --port 4200 --minimal
```

另外，到目前为止，所有这些都假设你的所有应用程序都在同一个 repo 中。然而，这并不是一个硬性要求。自动化在单库中工作得最好，但当然也可以适应于为每个应用程序建立单独的仓库。如果你想看看这个项目在运行这些命令后会是什么样子，这里有我创建的一个演示:

https://github.com/jtneal/ng-module-federation-demo

## 入门指南

如果你按照上面的描述安装了所有的东西，没有使用最小标志的话，你现在应该准备好了。

```sh
npm run run:all
```

如果你按照我上面的例子,这将平行地启动你的所有应用程序:

- Shell: http://localhost:4200
- MFE1: http://localhost:4210
- MFE2: http://localhost:4220
- MFE3: http://localhost:4230

正如你所看到的，如果你愿意，你仍然可以从shell中独立运行每个微型前端。

如果你将来增加更多的微前端，你需要更新你的微前端配置:

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

这些值被动态地拉入你的`main.ts`文件和`app-routing.module.ts`文件中。

### Minimal

如果你做了一个最小的安装，你将不得不自己做一些配置。在你的微型前端应用程序中，你需要一个模块来作为你的入口，这个模块不是你的AppModule。这个模块应该有一个路由器和一个为你的根路径定义的组件，像这样:

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

然后，在你的shell中，你需要定义指向微型前端的路由:

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

最后，简单地创建一些导航链接，指向这些路由:

```html
<nav>
  <ul>
    <li><a routerLink="/mfe1">MFE1</a></li>
    <li><a routerLink="/mfe2">MFE2</a></li>
    <li><a routerLink="/mfe3">MFE3</a></li>
  </ul>
</nav>
```

## 开发

### Build

运行 `npm run build` 来构建项目和原理图。

### Running unit tests

运行 `npm run test` 来执行单元测试。

### Running schematics tests

运行`npm run test:schematics`来执行schematics测试。

### Running end-to-end tests

运行 `npm run e2e` 来执行端对端测试。

如果你想使用无头浏览器，使用 `npm run e2e:headless` 代替。

### Running the tester app

该工作区包括一个测试程序，可以用来测试SDK的功能。使用 `ng serve mfe-tester` 运行它，并浏览http://localhost:4200。

## Contributing

我们感谢对该版本的反馈和贡献! 欢迎提交拉动请求，我们将与你一起工作，使其得到审查和合并。

## Support + Feedback

如需支持或提供反馈，请[在我们的问题跟踪器上提出一个问题](https://github.com/jtneal/ng-module-federation/issues).

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/jtneal/ng-module-federation/blob/main/LICENSE) file for more info.
