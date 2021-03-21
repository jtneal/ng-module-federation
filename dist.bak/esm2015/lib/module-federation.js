import { __awaiter } from "tslib";
const moduleMap = {};
const remoteMap = {};
let isDefaultScopeInitialized = false;
export function loadRemoteEntry(remoteEntry, remoteName) {
    return new Promise((resolve, reject) => {
        // Is remoteEntry already loaded?
        if (moduleMap[remoteEntry]) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = remoteEntry;
        script.onerror = reject;
        script.onload = () => {
            initRemote(remoteName);
            moduleMap[remoteEntry] = true;
            resolve();
        };
        document.body.append(script);
    });
}
export function initRemote(remoteName) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = window[remoteName];
        // Do we still need to initialize the remote?
        if (remoteMap[remoteName]) {
            return;
        }
        // Do we still need to initialize the share scope?
        if (!isDefaultScopeInitialized) {
            yield __webpack_init_sharing__('default');
            isDefaultScopeInitialized = true;
        }
        yield container.init(__webpack_share_scopes__.default);
        remoteMap[remoteName] = true;
        return container;
    });
}
export function lookupExposedModule(remoteName, exposedModule) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = window[remoteName];
        const factory = yield container.get(exposedModule);
        const Module = factory();
        return Module;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLWZlZGVyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJyYXJ5L3NyYy9saWIvbW9kdWxlLWZlZGVyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQVdBLE1BQU0sU0FBUyxHQUFHLEVBQUcsQ0FBQztBQUN0QixNQUFNLFNBQVMsR0FBRyxFQUFHLENBQUM7QUFDdEIsSUFBSSx5QkFBeUIsR0FBRyxLQUFLLENBQUM7QUFFdEMsTUFBTSxVQUFVLGVBQWUsQ0FBQyxXQUFtQixFQUFFLFVBQWtCO0lBQ3JFLE9BQU8sSUFBSSxPQUFPLENBQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDM0MsaUNBQWlDO1FBQ2pDLElBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQzFCLE9BQU8sRUFBRSxDQUFDO1lBRVYsT0FBTztTQUNSO1FBRUQsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVoRCxNQUFNLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQztRQUN6QixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV4QixNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtZQUNuQixVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdkIsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM5QixPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQztRQUVGLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELE1BQU0sVUFBZ0IsVUFBVSxDQUFDLFVBQWtCOztRQUNqRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFjLENBQUM7UUFFbEQsNkNBQTZDO1FBQzdDLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3pCLE9BQU87U0FDUjtRQUVELGtEQUFrRDtRQUNsRCxJQUFJLENBQUMseUJBQXlCLEVBQUU7WUFDOUIsTUFBTSx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxQyx5QkFBeUIsR0FBRyxJQUFJLENBQUM7U0FDbEM7UUFFRCxNQUFNLFNBQVMsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkQsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUU3QixPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0NBQUE7QUFFRCxNQUFNLFVBQWdCLG1CQUFtQixDQUFJLFVBQWtCLEVBQUUsYUFBcUI7O1FBQ3BGLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQWMsQ0FBQztRQUNsRCxNQUFNLE9BQU8sR0FBRyxNQUFNLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkQsTUFBTSxNQUFNLEdBQUcsT0FBTyxFQUFFLENBQUM7UUFFekIsT0FBTyxNQUFXLENBQUM7SUFDckIsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsidHlwZSBTY29wZSA9IHVua25vd247XG50eXBlIEZhY3RvcnkgPSAoKSA9PiBhbnk7XG5cbnR5cGUgQ29udGFpbmVyID0ge1xuICBpbml0KHNoYXJlU2NvcGU6IFNjb3BlKTogUHJvbWlzZTx2b2lkPjtcbiAgZ2V0KG1vZHVsZTogc3RyaW5nKTogUHJvbWlzZTxGYWN0b3J5Pjtcbn07XG5cbmRlY2xhcmUgY29uc3QgX193ZWJwYWNrX2luaXRfc2hhcmluZ19fOiAoc2hhcmVTY29wZTogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuZGVjbGFyZSBjb25zdCBfX3dlYnBhY2tfc2hhcmVfc2NvcGVzX186IHsgZGVmYXVsdDogU2NvcGUgfTtcblxuY29uc3QgbW9kdWxlTWFwID0geyB9O1xuY29uc3QgcmVtb3RlTWFwID0geyB9O1xubGV0IGlzRGVmYXVsdFNjb3BlSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRSZW1vdGVFbnRyeShyZW1vdGVFbnRyeTogc3RyaW5nLCByZW1vdGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAvLyBJcyByZW1vdGVFbnRyeSBhbHJlYWR5IGxvYWRlZD9cbiAgICBpZiAobW9kdWxlTWFwW3JlbW90ZUVudHJ5XSkge1xuICAgICAgcmVzb2x2ZSgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cbiAgICBzY3JpcHQuc3JjID0gcmVtb3RlRW50cnk7XG4gICAgc2NyaXB0Lm9uZXJyb3IgPSByZWplY3Q7XG5cbiAgICBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xuICAgICAgaW5pdFJlbW90ZShyZW1vdGVOYW1lKTtcbiAgICAgIG1vZHVsZU1hcFtyZW1vdGVFbnRyeV0gPSB0cnVlO1xuICAgICAgcmVzb2x2ZSgpO1xuICAgIH07XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZChzY3JpcHQpO1xuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRSZW1vdGUocmVtb3RlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxDb250YWluZXI+IHtcbiAgY29uc3QgY29udGFpbmVyID0gd2luZG93W3JlbW90ZU5hbWVdIGFzIENvbnRhaW5lcjtcblxuICAvLyBEbyB3ZSBzdGlsbCBuZWVkIHRvIGluaXRpYWxpemUgdGhlIHJlbW90ZT9cbiAgaWYgKHJlbW90ZU1hcFtyZW1vdGVOYW1lXSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERvIHdlIHN0aWxsIG5lZWQgdG8gaW5pdGlhbGl6ZSB0aGUgc2hhcmUgc2NvcGU/XG4gIGlmICghaXNEZWZhdWx0U2NvcGVJbml0aWFsaXplZCkge1xuICAgIGF3YWl0IF9fd2VicGFja19pbml0X3NoYXJpbmdfXygnZGVmYXVsdCcpO1xuICAgIGlzRGVmYXVsdFNjb3BlSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgYXdhaXQgY29udGFpbmVyLmluaXQoX193ZWJwYWNrX3NoYXJlX3Njb3Blc19fLmRlZmF1bHQpO1xuICByZW1vdGVNYXBbcmVtb3RlTmFtZV0gPSB0cnVlO1xuXG4gIHJldHVybiBjb250YWluZXI7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb29rdXBFeHBvc2VkTW9kdWxlPFQ+KHJlbW90ZU5hbWU6IHN0cmluZywgZXhwb3NlZE1vZHVsZTogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IHdpbmRvd1tyZW1vdGVOYW1lXSBhcyBDb250YWluZXI7XG4gIGNvbnN0IGZhY3RvcnkgPSBhd2FpdCBjb250YWluZXIuZ2V0KGV4cG9zZWRNb2R1bGUpO1xuICBjb25zdCBNb2R1bGUgPSBmYWN0b3J5KCk7XG5cbiAgcmV0dXJuIE1vZHVsZSBhcyBUO1xufVxuIl19