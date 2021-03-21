import { Rule } from '@angular-devkit/schematics';
/**
 * Convert the project to use asyncronous dynamic imports.
 * This is required for projects using the ModuleFederationPlugin.
 * Also updates the main script to dynamically load remote entries.
 * For more detailed information, checkout this article by Manfred Steyer:
 * https://www.angulararchitects.io/aktuelles/the-microfrontend-revolution-part-2-module-federation-with-angular
 */
export declare function updateBootstrap(isShell: boolean, main: string): Rule;
