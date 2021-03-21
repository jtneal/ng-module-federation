"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChanges = void 0;
const change_1 = require("@schematics/angular/utility/change");
function handleChanges(host, path, changes) {
    const recorder = host.beginUpdate(path);
    change_1.applyToUpdateRecorder(recorder, changes);
    host.commitUpdate(recorder);
    return host;
}
exports.handleChanges = handleChanges;
//# sourceMappingURL=changes.js.map