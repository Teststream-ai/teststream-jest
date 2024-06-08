"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusMapping = void 0;
var statusMapping = function (status) {
    if (status === 'passed') {
        return 1;
    }
    else if (status === 'failed') {
        return 2;
    }
    else if (status === 'pending') {
        return 4;
    }
    else {
        return 0;
    }
};
exports.statusMapping = statusMapping;
//# sourceMappingURL=status.js.map