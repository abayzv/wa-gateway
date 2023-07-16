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
var payment_services_1 = require("./payment.services");
var router = express_1.default.Router();
// Validation Rules
var rules = {
    name: {
        optional: true,
    },
    type: {
        optional: true,
        isIn: {
            options: [["semester", "monthly", "registration"]],
            errorMessage: "Type must be semester, monthly or registration",
        },
    },
};
var createRules = {
    name: {
        notEmpty: {
            errorMessage: "Name is required",
        },
    },
    type: {
        notEmpty: {
            errorMessage: "Type is required",
        },
        isIn: {
            options: [["semester", "monthly", "registration"]],
            errorMessage: "Type must be semester, monthly or registration",
        },
    },
    amount: {
        notEmpty: {
            errorMessage: "Amount is required",
        },
        custom: {
            options: function (value) {
                if (typeof value !== "number")
                    throw new Error("Amount must be a number");
                return true;
            },
        },
    },
};
var updateRules = {
    name: {
        optional: true,
        isLength: {
            options: { min: 3, max: 255 },
            errorMessage: "Name must be at least 3 characters long",
        },
    },
    type: {
        optional: true,
        isIn: {
            options: [["semester", "monthly", "registration"]],
            errorMessage: "Type must be semester, monthly or registration",
        },
    },
    amount: {
        optional: true,
        custom: {
            options: function (value) {
                if (typeof value !== "number")
                    throw new Error("Amount must be a number");
                return true;
            },
        },
    },
};
// get all payment
router.get("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error, _a, name, type, query, payments, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                error = (0, express_validator_1.validationResult)(req);
                if (!error.isEmpty())
                    return [2 /*return*/, res.status(422).json(error.array())];
                _a = (0, express_validator_1.matchedData)(req, { locations: ["query"] }), name = _a.name, type = _a.type;
                query = {
                    name: name,
                    type: type,
                    page: req.query.page,
                    show: req.query.show,
                };
                return [4 /*yield*/, (0, payment_services_1.getAllPayment)(query)];
            case 1:
                payments = _b.sent();
                res.json(payments);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                next(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// show payment
router.get("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, payment, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, payment_services_1.getPaymentById)(id)];
            case 1:
                payment = _a.sent();
                if (!payment)
                    return [2 /*return*/, res.status(404).json({ message: "Payment not found" })];
                res.json({ data: payment });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// create payment
router.post("/", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Create Payment", "Successfully create payment"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(createRules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, payment, paymentData, isExist, result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(422).json({ errors: errors.array() })];
                payment = (0, express_validator_1.matchedData)(req);
                paymentData = {
                    name: payment.name,
                    type: payment.type,
                    amount: payment.amount,
                };
                return [4 /*yield*/, (0, payment_services_1.getPaymentByName)(payment.name)];
            case 1:
                isExist = _a.sent();
                if (isExist)
                    return [2 /*return*/, res.status(409).json({ message: "Payment already exist" })];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, payment_services_1.createPayment)(paymentData)];
            case 3:
                result = _a.sent();
                res.json({ data: result });
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// update payment
router.put("/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Update Payment", "Successfully update payment"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(updateRules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, id, payment, paymentData, isExist, isExistName, result, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(422).json({ errors: errors.array() })];
                id = req.params.id;
                payment = (0, express_validator_1.matchedData)(req);
                paymentData = {
                    name: payment.name,
                    type: payment.type,
                    amount: payment.amount,
                };
                return [4 /*yield*/, (0, payment_services_1.getPaymentById)(id)];
            case 1:
                isExist = _a.sent();
                if (!isExist)
                    return [2 /*return*/, res.status(404).json({ message: "Payment not found" })];
                return [4 /*yield*/, (0, payment_services_1.getPaymentByName)(payment.name)];
            case 2:
                isExistName = _a.sent();
                if (isExistName)
                    return [2 /*return*/, res.status(409).json({
                            message: "Payment for name ".concat(isExistName.name, " is already exist"),
                        })];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, payment_services_1.updatePayment)(id, paymentData)];
            case 4:
                result = _a.sent();
                res.json({ message: "Update payment success", data: result });
                return [3 /*break*/, 6];
            case 5:
                err_4 = _a.sent();
                next(err_4);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// delete payment
router.delete("/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Delete Payment", "Successfully delete payment"), middlewares_1.isPermited, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, payment, result, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, (0, payment_services_1.getPaymentById)(id)];
            case 1:
                payment = _a.sent();
                if (!payment)
                    return [2 /*return*/, res.status(404).json({ message: "Payment not found" })];
                return [4 /*yield*/, (0, payment_services_1.deletePayment)(id)];
            case 2:
                result = _a.sent();
                res.json({ message: "Delete payment success" });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                next(err_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=payment.routes.js.map