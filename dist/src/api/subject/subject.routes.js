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
var express_validator_1 = require("express-validator");
var middlewares_1 = require("../../middlewares");
var subject_services_1 = require("./subject.services");
var router = express_1.default.Router();
// Validation Rules
var rules = {
    name: {
        optional: true,
    },
};
var createRules = {
    name: {
        notEmpty: true,
        errorMessage: "Name is required",
    },
};
// Get all subjects
router.get("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, name, query, subjects, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(422).json(errors.array())];
                name = (0, express_validator_1.matchedData)(req, {
                    locations: ["query"],
                }).name;
                query = {
                    name: name,
                    page: req.query.page,
                    show: req.query.show,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, subject_services_1.getAllSubject)(query)];
            case 2:
                subjects = _a.sent();
                res.json(subjects);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get subject by id
router.get("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, subject, teacherList, scoreList, data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, subject_services_1.getSubjectById)(id)];
            case 2:
                subject = _a.sent();
                if (!subject)
                    return [2 /*return*/, res.status(404).json({ message: "Subject not found" })];
                teacherList = function (teachers) {
                    return teachers.map(function (teacher) {
                        return {
                            id: teacher.id,
                            name: teacher.profile.name,
                            photo: teacher.profile.photo,
                        };
                    });
                };
                scoreList = function (scores) {
                    return scores.map(function (score) {
                        return {
                            id: score.user.id,
                            score: score.score,
                            name: score.user.profile.name,
                            photo: score.user.profile.photo,
                        };
                    });
                };
                data = {
                    id: subject.id,
                    name: subject.name,
                    teacher: teacherList(subject.user),
                    score: scoreList(subject.score),
                };
                res.json(data);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create subject
router.post("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, express_validator_1.checkSchema)(createRules), (0, middlewares_1.activityLogger)("Create subject", "Success create subject"), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, name, isExist, data, subject, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(422).json(errors.array())];
                name = (0, express_validator_1.matchedData)(req, {
                    locations: ["body"],
                }).name;
                return [4 /*yield*/, (0, subject_services_1.findSubjectByName)(name)];
            case 1:
                isExist = _a.sent();
                if (isExist)
                    return [2 /*return*/, res.status(422).json({ message: "Subject name already exist" })];
                data = {
                    name: name,
                };
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, subject_services_1.createSubject)(data)];
            case 3:
                subject = _a.sent();
                res.json({ message: "Subject created", data: subject });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Update subject
router.put("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), (0, middlewares_1.activityLogger)("Update subject", "Success update subject"), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, id, name, isExist, data, subject, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(422).json(errors.array())];
                id = req.params.id;
                name = (0, express_validator_1.matchedData)(req, {
                    locations: ["body"],
                }).name;
                return [4 /*yield*/, (0, subject_services_1.findSubjectByName)(name)];
            case 1:
                isExist = _a.sent();
                if (isExist)
                    return [2 /*return*/, res.status(422).json({ message: "Subject name already exist" })];
                data = {
                    name: name,
                };
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 6]);
                return [4 /*yield*/, (0, subject_services_1.getSubjectById)(id)];
            case 3:
                subject = _a.sent();
                if (!subject)
                    return [2 /*return*/, res.status(404).json({ message: "Subject not found" })];
                return [4 /*yield*/, (0, subject_services_1.updateSubject)(id, data)];
            case 4:
                _a.sent();
                res.json({ message: "Subject updated", data: subject });
                return [3 /*break*/, 6];
            case 5:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Delete subject
router.delete("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, middlewares_1.activityLogger)("Delete subject", "Success delete subject"), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, subject, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, subject_services_1.getSubjectById)(id)];
            case 2:
                subject = _a.sent();
                if (!subject)
                    return [2 /*return*/, res.status(404).json({ message: "Subject not found" })];
                return [4 /*yield*/, (0, subject_services_1.deleteSubject)(id)];
            case 3:
                _a.sent();
                res.json({ message: "Subject deleted" });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=subject.routes.js.map