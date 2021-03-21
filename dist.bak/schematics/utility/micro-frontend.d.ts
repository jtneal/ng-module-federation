import { Rule } from '@angular-devkit/schematics';
import { Application } from './applications';
export declare function addMicroFrontendConfiguration(applications: Application[], sourceRoot: string): Rule;
export declare function generateMicroFrontendEntryPoint(project: string, prefix: string): Rule;
