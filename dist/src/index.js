"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var port = process.env.PORT || 5000;
app_1.default.listen(port, function () {
    /* eslint-disable no-console */
    console.log("Listening: http://localhost:".concat(port));
    /* eslint-enable no-console */
});
//# sourceMappingURL=index.js.map