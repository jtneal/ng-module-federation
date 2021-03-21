import { workspaces } from '@angular-devkit/core';
export interface Application {
    accessor?: string;
    classified: string;
    dasherized: string;
    name: string;
    port: number;
    property?: string;
}
export declare function getSupportedApplications(workspace: workspaces.WorkspaceDefinition, project: string): Application[];
