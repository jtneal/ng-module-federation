export async function lookupExposedModule<T>(remoteName: string, exposedModule: string): Promise<T> {
  const container = window[remoteName as any] as any;
  const factory = await container.get(exposedModule);
  const Module = factory();

  return Module as T;
}
