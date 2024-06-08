"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var Logger = /** @class */ (function () {
    function Logger() {
        this.prefix = '[TESTSTREAM]';
    }
    Logger.prototype.info = function (message) {
        console.log(chalk_1.default.blue("".concat(this.prefix, " ").concat(message)));
    };
    Logger.prototype.error = function (message) {
        console.error(chalk_1.default.red("".concat(this.prefix, " ").concat(message)));
    };
    return Logger;
}());
exports.default = Logger;
//# sourceMappingURL=logger.js.map