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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = __importDefault(require("./api"));
var scan_1 = require("./lib/scan");
var logger_1 = __importDefault(require("./lib/logger"));
var status_1 = require("./lib/status");
var TeststreamReporter = /** @class */ (function () {
    // protected _globalConfig: Config.GlobalConfig;
    // Add the config to our constructor
    function TeststreamReporter(config, options, runName) {
        this.config = config;
        this._options = options;
        this.api = new api_1.default(options.apiKey);
        this.runName = this._options.runName;
        this.logger = new logger_1.default();
    }
    TeststreamReporter.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var projectId, data_1, error_1, runDetails, error_2, a, body, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info('Starting JEST automation test run');
                        projectId = process.env.PROJECT_ID;
                        if (!!projectId) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.api.getProjectBySlug(this._options.projectID)];
                    case 2:
                        data_1 = _a.sent();
                        process.env['PROJECT_ID'] = data_1 === null || data_1 === void 0 ? void 0 : data_1.id;
                        this.logger.info("Project found. Using ".concat(data_1.name, " project with slug ").concat(data_1.slug, "."));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error fetching project data:', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.logger.info("Project found. Using project with slug ".concat(projectId));
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.api.createRun({
                                name: this.runName || 'Automation run ' + new Date().toLocaleString(),
                                projectId: process.env.PROJECT_ID,
                            })];
                    case 7:
                        runDetails = _a.sent();
                        process.env['RUN_ID'] = runDetails.id;
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 9];
                    case 9:
                        this.logger.info("New run successfully created. Run name ".concat(runDetails.name));
                        return [4 /*yield*/, (0, scan_1.scanTestFiles)()];
                    case 10:
                        a = _a.sent();
                        body = a.map(function (item) {
                            return { runId: process.env.RUN_ID, spec: item };
                        });
                        return [4 /*yield*/, this.api.createRunSpecBulk(body)];
                    case 11:
                        data = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TeststreamReporter.prototype.onTestFileResult = function (test, testResult, aggregatedResult) {
        return __awaiter(this, void 0, void 0, function () {
            var path, b, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = (0, scan_1.getPathDifference)(process.cwd(), testResult.testFilePath).path2Difference;
                        return [4 /*yield*/, this.api.findUniqueSpec(process.env.RUN_ID, path)];
                    case 1:
                        b = _a.sent();
                        results = extractTestResults(testResult.testResults, b.id);
                        return [4 /*yield*/, this.api.createBulkTestResults(results)];
                    case 2:
                        _a.sent();
                        this.logger.info("Run spec completed. Results of test ".concat(path, " can be found here."));
                        return [2 /*return*/];
                }
            });
        });
    };
    TeststreamReporter.prototype.onRunStart = function (results, options) {
        this.init();
        this.logger.info('Run started');
    };
    TeststreamReporter.prototype.onRunComplete = function (context, results) {
        this.logger.info('Run successfully complete. Results are uploaded to Teststream');
    };
    return TeststreamReporter;
}());
exports.default = TeststreamReporter;
var extractTestResults = function (testResults, runSpecId) {
    return testResults.map(function (item) {
        return {
            runSpecId: runSpecId,
            title: item.title,
            fullTitle: item.fullName,
            duration: item.duration,
            status: (0, status_1.statusMapping)(item.status),
            suite: item.ancestorTitles[0],
            error: item.failureMessages[0] && stripAnsiCodes(item.failureMessages[0]),
        };
    });
};
function stripAnsiCodes(str) {
    // Regular expression to match ANSI escape codes
    var ansiRegex = /\x1B\[[0-9;]*[a-zA-Z]/g;
    return str.replace(ansiRegex, '').replace(/\n/g, ' ');
}
//# sourceMappingURL=index.js.map