import { Rule } from '@angular-devkit/schematics';
import { Application } from './applications';
export declare function addNavToShell(applications: Application[], sourceRoot: string, project: string): Rule;
export declare function updateNavTemplate(applications: Application[], sourceRoot: string): Rule;
export declare function addNavToAppComponent(sourceRoot: string): Rule;
