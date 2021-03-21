declare type Scope = unknown;
declare type Factory = () => any;
declare type Container = {
    init(shareScope: Scope): Promise<void>;
    get(module: string): Promise<Factory>;
};
export declare function loadRemoteEntry(remoteEntry: string, remoteName: string): Promise<void>;
export declare function initRemote(remoteName: string): Promise<Container>;
export declare function lookupExposedModule<T>(remoteName: string, exposedModule: string): Promise<T>;
export {};
