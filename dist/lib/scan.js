"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathDifference = exports.scanTestFiles = void 0;
var exec = require('child_process').exec;
var util = require('util');
var execAsync = util.promisify(exec);
var path = require('path');
function extractAndProcessFilenames(paths) {
    return paths.map(function (filePath) {
        return filePath.startsWith('./') ? filePath.slice(2) : filePath;
    });
}
function scanTestFiles() {
    return __awaiter(this, void 0, void 0, function () {
        var stdout, files, updatedFileNames, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, execAsync('find . -type f -name "*.test.*" -not -path "./node_modules/*" -not -path "./reports/*"')];
                case 1:
                    stdout = (_a.sent()).stdout;
                    files = stdout.split('\n').filter(function (line) { return line !== ''; });
                    updatedFileNames = extractAndProcessFilenames(files);
                    return [2 /*return*/, updatedFileNames];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error generating test files list:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.scanTestFiles = scanTestFiles;
// Example usage
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var files;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, scanTestFiles()];
            case 1:
                files = _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
function getPathDifference(path1, path2) {
    // Normalize the paths to avoid issues with different separators
    var normalizedPath1 = path.normalize(path1);
    var normalizedPath2 = path.normalize(path2);
    // Split the paths into components
    var parts1 = normalizedPath1.split(path.sep);
    var parts2 = normalizedPath2.split(path.sep);
    // Find the common prefix
    var commonIndex = 0;
    while (commonIndex < Math.min(parts1.length, parts2.length) && parts1[commonIndex] === parts2[commonIndex]) {
        commonIndex++;
    }
    // Get the difference parts
    var differenceParts1 = parts1.slice(commonIndex);
    var differenceParts2 = parts2.slice(commonIndex);
    // Return the differences as strings
    return {
        path1Difference: differenceParts1.join(path.sep),
        path2Difference: differenceParts2.join(path.sep)
    };
}
exports.getPathDifference = getPathDifference;
//# sourceMappingURL=scan.js.map