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
var express_1 = __importDefault(require("express"));
var middlewares_1 = require("../../middlewares");
var express_validator_1 = require("express-validator");
var scoreCategory_services_1 = require("./scoreCategory.services");
var router = express_1.default.Router();
var rules = {
    name: {
        notEmpty: {
            errorMessage: "Name is required",
        },
    },
};
// Get all score category
router.get("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var query, scoreCategories, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = {
                    page: req.query.page,
                    show: req.query.show,
                    name: req.query.name,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, scoreCategory_services_1.getScoreCategoryList)(query)];
            case 2:
                scoreCategories = _a.sent();
                res.json(scoreCategories);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// create score category
router.post("/", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Create score category", "Success create score category"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, name, scoreCategory, scoreCategory_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(422).json(errors.array())];
                name = (0, express_validator_1.matchedData)(req, {
                    locations: ["body"],
                }).name;
                return [4 /*yield*/, (0, scoreCategory_services_1.findScoreCategoryByName)(name)];
            case 1:
                scoreCategory = _a.sent();
                if (scoreCategory)
                    return [2 /*return*/, res.status(409).json({ message: "Score category already exists" })];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, scoreCategory_services_1.createScoreCategory)(name)];
            case 3:
                scoreCategory_1 = _a.sent();
                res.json({
                    message: "Score category created successfully",
                    data: scoreCategory_1,
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Update score category
router.put("/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Update score category", "Success update score category"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, name, scoreCategory, scoreCategoryByName, scoreCategory_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(422).json(errors.array())];
                name = (0, express_validator_1.matchedData)(req, {
                    locations: ["body"],
                }).name;
                return [4 /*yield*/, (0, scoreCategory_services_1.findScoreCategoryById)(req.params.id)];
            case 1:
                scoreCategory = _a.sent();
                if (!scoreCategory)
                    return [2 /*return*/, res.status(404).json({ message: "Score Category not found" })];
                return [4 /*yield*/, (0, scoreCategory_services_1.findScoreCategoryByName)(name)];
            case 2:
                scoreCategoryByName = _a.sent();
                if (scoreCategoryByName)
                    return [2 /*return*/, res.status(409).json({ message: "Score category already exists" })];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, scoreCategory_services_1.updateCategory)(req.params.id, name)];
            case 4:
                scoreCategory_2 = _a.sent();
                res.json({
                    message: "Score category updated successfully",
                    data: scoreCategory_2,
                });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Delete score category
router.delete("/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Delete score category", "Success delete score category"), middlewares_1.isPermited, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var scoreCategory, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, scoreCategory_services_1.findScoreCategoryById)(req.params.id)];
            case 1:
                scoreCategory = _a.sent();
                if (!scoreCategory)
                    return [2 /*return*/, res.status(404).json({ message: "Score category not found" })];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, scoreCategory_services_1.deleteScoreCategory)(req.params.id)];
            case 3:
                _a.sent();
                res.json({
                    message: "Score category deleted successfully",
                });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=scoreCategory.routes.js.map