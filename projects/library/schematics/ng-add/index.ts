import { join, normalize, strings } from '@angular-devkit/core';
import { apply, applyTemplates, chain, externalSchematic, mergeWith, move, Rule, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';

import { getSupportedApplications } from '../utility/applications';
import { updateBootstrap } from '../utility/bootstrap';
import { addRequiredDependencies, installDependencies, optInToWebpack5 } from '../utility/dependencies';
import { addMicroFrontendConfiguration, generateMicroFrontendEntryPoint } from '../utility/micro-frontend';
import { addNavToShell } from '../utility/nav';
import { addRouteToMicroFrontend, addRouteToShell } from '../utility/routes';
import { Schema } from './schema';

export function ngAdd(options: Schema): Rule {
  return async (host: Tree): Promise<Rule> => {
    const workspace = await getWorkspace(host);

    if (!options.project) {
      options.project = workspace.extensions.defaultProject as string;
    }

    if (!options.project) {
      throw new SchematicsException('No default project found. Please specifiy a project name!');
    }

    const project = options.project;
    const config = workspace.projects.get(project);

    if (!config) {
      throw new SchematicsException(`Project ${project} not found!`);
    }

    if (config.extensions.projectType !== ProjectType.Application) {
      throw new SchematicsException(`Only projects of type "${ProjectType.Application}" are supported!`);
    }

    const port = parseInt(options.port, 10);

    if (isNaN(port)) {
      throw new SchematicsException('Port must be a number!');
    }

    const build = config.targets.get('build');

    if (!build) {
      throw new SchematicsException('Invalid application configuration: "build" not found!');
    }

    if (!build.options) {
      build.options = { };
    }

    if (!build.configurations) {
      build.configurations = { production: { } };
    }

    if (!build.configurations.production) {
      build.configurations.production = { };
    }

    const serve = config.targets.get('serve');

    if (!serve) {
      throw new SchematicsException('Invalid application configuration: "serve" not found!');
    }

    if (!serve.options) {
      serve.options = { };
    }

    if (!serve.configurations) {
      serve.configurations = { production: { } };
    }

    if (!serve.configurations.production) {
      serve.configurations.production = { };
    }

    const test = config.targets.get('test');

    if (!test) {
      throw new SchematicsException('Invalid application configuration: "test" not found!');
    }

    if (!test.options) {
      test.options = { };
    }

    const webpackPath = join(normalize(config.root), 'webpack.config.js');
    const webpackProdPath = join(normalize(config.root), 'webpack.prod.config.js');

    build.options.extraWebpackConfig = webpackPath;
    build.configurations.production.extraWebpackConfig = webpackProdPath;
    serve.options.extraWebpackConfig = webpackPath;
    serve.options.port = port;
    serve.configurations.production.extraWebpackConfig = webpackProdPath;
    test.options.extraWebpackConfig = webpackPath;

    const applications = getSupportedApplications(workspace, project);
    const isShell = options.type === 'shell';
    const sourceRoot = config.sourceRoot as string;

    const templateSource = apply(url('./files'), [
      applyTemplates({ ...strings, isShell, project, root: config.root }),
      move(normalize(config.root)),
    ]);

    const shellRules: Rule[] = [
      addMicroFrontendConfiguration(applications, sourceRoot),
      optInToWebpack5(),
      addRequiredDependencies(applications, project),
      installDependencies(),
    ];
    const microRules: Rule[] = [];

    if (!options.minimal) {
      shellRules.push(
        addNavToShell(applications, sourceRoot, project),
        addRouteToShell(sourceRoot),
      );

      microRules.push(
        generateMicroFrontendEntryPoint(project, config.prefix as string),
        addRouteToMicroFrontend(sourceRoot, project),
      );
    }

    return chain([
      updateWorkspace(workspace),
      mergeWith(templateSource),
      updateBootstrap(isShell, build.options.main as string),
      externalSchematic('ngx-build-plus', 'ng-add', { project: options.project }),
      chain(isShell ? shellRules : microRules),
    ]);
  };
}
