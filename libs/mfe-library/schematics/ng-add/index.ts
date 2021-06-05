import { normalize, strings } from '@angular-devkit/core';
import { apply, applyTemplates, chain, externalSchematic, mergeWith, move, Rule, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';
import * as path from 'path';

import { getSupportedApplications } from '../utility/applications';
import { updateBootstrap } from '../utility/bootstrap';
import { chainIf } from '../utility/chain';
import { updateAngularConfig } from '../utility/config';
import { installDependencies, updatePackageJson } from '../utility/dependencies';
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

    const applications = getSupportedApplications(workspace, project);
    const build = config.targets.get('build');
    const isShell = options.type === 'shell';
    const port = parseInt(options.port, 10);
    const sourceRoot = config.sourceRoot as string;
    const tsConfigName = host.exists('tsconfig.base.json') ? 'tsconfig.base.json' : 'tsconfig.json';
    const relTsConfigPath = path
      .join(path.relative(config.root, ''), tsConfigName)
      .replace(/\\/g, '/');

    const templateSource = apply(url('./files'), [
      applyTemplates({ ...strings, isShell, project, relTsConfigPath, root: config.root }),
      move(normalize(config.root)),
    ]);

    return chain([
      updateAngularConfig(config, port),
      updateWorkspace(workspace),
      mergeWith(templateSource),
      updateBootstrap(isShell, build?.options?.main as string),
      externalSchematic('ngx-build-plus', 'ng-add', { project: options.project }),
      chainIf(isShell, [
        addMicroFrontendConfiguration(applications, sourceRoot),
        updatePackageJson(),
        installDependencies(),
        chainIf(!options.minimal, [
          addNavToShell(applications, sourceRoot, project),
          addRouteToShell(sourceRoot),
        ]),
      ]),
      chainIf(!isShell && !options.minimal, [
        generateMicroFrontendEntryPoint(project, config.prefix as string),
        addRouteToMicroFrontend(sourceRoot, project),
      ]),
    ]);
  };
}
