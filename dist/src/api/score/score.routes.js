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
var score_services_1 = require("./score.services");
var users_services_1 = require("../users/users.services");
var subject_services_1 = require("../subject/subject.services");
var classroom_services_1 = require("../classroom/classroom.services");
var scoreCategory_services_1 = require("../scoreCategory/scoreCategory.services");
var router = express_1.default.Router();
var rules = {
    classId: {
        notEmpty: {
            errorMessage: "Class Id is required",
        },
    },
    subjectId: {
        notEmpty: {
            errorMessage: "Subject Id is required",
        },
        custom: {
            options: function (value) {
                // valu of array must be string
                if (!Array.isArray(value))
                    throw new Error("Subject Id must be array");
                value.forEach(function (element) {
                    if (typeof element !== "string")
                        throw new Error("Subject Id must be array of string");
                });
                return true;
            },
        },
    },
    scoreCategoryId: {
        notEmpty: {
            errorMessage: "Score Category Id is required",
        },
    },
};
var updateRules = {
    userId: {
        notEmpty: {
            errorMessage: "User Id is required",
        },
    },
    subjectId: {
        notEmpty: {
            errorMessage: "Subject Id is required",
        },
        custom: {
            options: function (value) {
                // valu of array must be string
                if (!Array.isArray(value))
                    throw new Error("Subject Id must be array");
                value.forEach(function (element) {
                    if (typeof element !== "string")
                        throw new Error("Subject Id must be array of string");
                });
                return true;
            },
        },
    },
    scoreCategoryId: {
        notEmpty: {
            errorMessage: "Score Category Id is required",
        },
    },
    score: {
        notEmpty: {
            errorMessage: "Score is required",
        },
        custom: {
            options: function (value) {
                // if typeof value !== "number" return false;
                if (typeof value !== "number")
                    return false;
                return true;
            },
        },
    },
};
var deleteRules = {
    userId: {
        notEmpty: {
            errorMessage: "User Id is required",
        },
    },
    subjectId: {
        notEmpty: {
            errorMessage: "Subject Id is required",
        },
        custom: {
            options: function (value) {
                // valu of array must be string
                if (!Array.isArray(value))
                    throw new Error("Subject Id must be array");
                value.forEach(function (element) {
                    if (typeof element !== "string")
                        throw new Error("Subject Id must be array of string");
                });
                return true;
            },
        },
    },
    scoreCategoryId: {
        notEmpty: {
            errorMessage: "Score Category Id is required",
        },
    },
};
// create score list
router.post("/generate", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), (0, middlewares_1.activityLogger)("Generate Score", "Socre Successfully Generated"), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, classId, subjectId, scoreCategoryId, classroom, subject, scoreCategory, dataScore, scoreList, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(422).json(errors.array())];
                _a = (0, express_validator_1.matchedData)(req, {
                    locations: ["body"],
                }), classId = _a.classId, subjectId = _a.subjectId, scoreCategoryId = _a.scoreCategoryId;
                return [4 /*yield*/, (0, classroom_services_1.getClassroomsById)(classId)];
            case 1:
                classroom = _b.sent();
                if (!classroom)
                    return [2 /*return*/, res.status(422).json({ message: "Classroom not found" })];
                return [4 /*yield*/, (0, subject_services_1.findSubjectByManyId)(subjectId)];
            case 2:
                subject = _b.sent();
                if (!subject)
                    return [2 /*return*/, res.status(422).json({ message: "Subject not found" })];
                return [4 /*yield*/, (0, scoreCategory_services_1.findScoreCategoryById)(scoreCategoryId)];
            case 3:
                scoreCategory = _b.sent();
                if (!scoreCategory)
                    return [2 /*return*/, res.status(422).json({ message: "Score Category not found" })];
                dataScore = {
                    classId: classId,
                    subjectId: subjectId,
                    scoreCategoryId: scoreCategoryId,
                };
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, (0, score_services_1.createScoreList)(dataScore)];
            case 5:
                scoreList = _b.sent();
                res.json({ message: "Score list created" });
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// update score
router.put("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, express_validator_1.checkSchema)(updateRules), (0, middlewares_1.activityLogger)("Update Score", "Score Successfully Updated"), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, userId, subjectId, scoreCategoryId, score, user, subject, scoreCategory, dataScore, score_1, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(422).json(errors.array())];
                _a = (0, express_validator_1.matchedData)(req, {
                    locations: ["body"],
                }), userId = _a.userId, subjectId = _a.subjectId, scoreCategoryId = _a.scoreCategoryId, score = _a.score;
                return [4 /*yield*/, (0, users_services_1.findUserById)(userId)];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.status(422).json({ message: "User not found" })];
                return [4 /*yield*/, (0, subject_services_1.findSubjectByManyId)(subjectId)];
            case 2:
                subject = _b.sent();
                if (!subject)
                    return [2 /*return*/, res.status(422).json({ message: "Subject not found" })];
                return [4 /*yield*/, (0, scoreCategory_services_1.findScoreCategoryById)(scoreCategoryId)];
            case 3:
                scoreCategory = _b.sent();
                if (!scoreCategory)
                    return [2 /*return*/, res.status(422).json({ message: "Score Category not found" })];
                dataScore = {
                    userId: userId,
                    subjectId: subjectId,
                    scoreCategoryId: scoreCategoryId,
                    score: score,
                };
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, (0, score_services_1.updateScore)(dataScore)];
            case 5:
                score_1 = _b.sent();
                res.json({ message: "Score successfully updated" });
                return [3 /*break*/, 7];
            case 6:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// delete score
router.delete("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, middlewares_1.activityLogger)("Delete Score", "Score Successfully Deleted"), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, score, score_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, (0, score_services_1.findScoreById)(id)];
            case 1:
                score = _a.sent();
                if (!score)
                    return [2 /*return*/, res.status(422).json({ message: "Score not found" })];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, score_services_1.deleteScore)(id)];
            case 3:
                score_2 = _a.sent();
                res.json({ message: "Score successfully deleted" });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=score.routes.js.map