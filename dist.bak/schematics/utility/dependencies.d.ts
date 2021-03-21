import { Rule } from '@angular-devkit/schematics';
import { Application } from './applications';
export declare function optInToWebpack5(): Rule;
export declare function addRequiredDependencies(applications: Application[], project: string): Rule;
export declare function installDependencies(): Rule;
