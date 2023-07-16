"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var transaction_services_1 = require("./transaction.services");
var fs_1 = __importDefault(require("fs"));
// @ts-ignore
var base64_img_1 = __importDefault(require("base64-img"));
var router = express_1.default.Router();
// Validation Rules
var rules = {
    payment_type: {
        notEmpty: {
            errorMessage: "Payment Type is required",
        },
        isIn: {
            options: [["gopay", "bank_transfer", "qris"]],
            errorMessage: "Payment Type must be gopay, qris or bank_transfer",
        },
    },
    gross_amount: {
        notEmpty: {
            errorMessage: "Gross Amount is required",
        },
        isNumeric: {
            errorMessage: "Gross Amount must be a number",
        },
    },
    order_id: {
        notEmpty: {
            errorMessage: "Order ID is required",
        },
    },
    callback_url: {
        optional: true,
        isURL: {
            errorMessage: "Callback URL must be a valid URL",
        },
    },
};
var queryRules = {
    referenceId: {
        optional: true,
    },
    startDate: {
        optional: true,
        isDate: {
            errorMessage: "Start Date must be a valid date",
        },
    },
    endDate: {
        optional: true,
        isDate: {
            errorMessage: "End Date must be a valid date",
        },
    },
};
var addTransactionRules = {
    payment: {
        isArray: {
            errorMessage: "Payment must be an array",
        },
        notEmpty: {
            errorMessage: "Payment is required",
        },
        custom: {
            options: function (value) {
                // must be have id and notes ar optional
                var isValid = value.every(function (item) { return item.id && typeof item.id === "string"; });
                if (!isValid)
                    throw new Error("Payment must be have id");
                return true;
            },
        },
    },
    userId: {
        notEmpty: {
            errorMessage: "User ID is required",
        },
    },
    paymentMethodId: {
        notEmpty: {
            errorMessage: "Payment Method Id is required",
        },
        custom: {
            options: function (value) {
                // value must be integer
                if (!Number.isInteger(value)) {
                    throw new Error("Payment Method Id must be an integer");
                }
                return true;
            },
        },
    },
};
// get all transactions
router.get("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, express_validator_1.checkSchema)(queryRules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, referenceId, startDate, endDate, query, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(422).json(errors.array())];
                _a = (0, express_validator_1.matchedData)(req, {
                    locations: ["query"],
                }), referenceId = _a.referenceId, startDate = _a.startDate, endDate = _a.endDate;
                query = {
                    referenceId: referenceId,
                    startDate: startDate,
                    endDate: endDate,
                    page: req.query.page,
                    show: req.query.show,
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, transaction_services_1.getAllTransaction)(query)];
            case 2:
                result = _b.sent();
                res.json(result);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// get transaction by id
router.get("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, transactions, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, transaction_services_1.getTransactionById)(id)];
            case 1:
                result = _c.sent();
                if (!result)
                    return [2 /*return*/, res.status(404).json({ message: "Transaction not found" })];
                transactions = {
                    id: result.id,
                    referenceId: result.referenceNumber,
                    paymentMethod: result.paymentMethod.name,
                    status: result.status,
                    user: {
                        name: (_b = (_a = result.user) === null || _a === void 0 ? void 0 : _a.profile) === null || _b === void 0 ? void 0 : _b.name,
                    },
                    items: result.items.map(function (item) { return ({
                        name: item.payment.name,
                        type: item.payment.type,
                        amount: item.payment.amount,
                        notes: item.notes,
                    }); }),
                    createdAt: result.createdAt,
                };
                res.json({ data: transactions });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _c.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Charge
router.post("/charge", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, payment, paymentData, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(422).json({ errors: errors.array() })];
                }
                payment = (0, express_validator_1.matchedData)(req);
                paymentData = {
                    payment_type: payment.payment_type,
                    gross_amount: payment.gross_amount,
                    order_id: payment.order_id,
                    callback_url: payment.callback_url,
                };
                return [4 /*yield*/, (0, transaction_services_1.charge)(paymentData)];
            case 1:
                result = _a.sent();
                res.json({ data: result });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Cancel Transaction
router.post("/:orderId/cancel", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Cancel Transaction", "Successfully cancel transaction"), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.params.orderId;
                return [4 /*yield*/, (0, transaction_services_1.cancelTransaction)(orderId)];
            case 1:
                result = _a.sent();
                res.json({ data: result });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get Status
router.get("/:orderId/status", middlewares_1.isAuthenticated, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, result, url, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.params.orderId;
                return [4 /*yield*/, (0, transaction_services_1.getStatus)(orderId)];
            case 1:
                result = _a.sent();
                url = req.protocol +
                    "://" +
                    req.get("host") +
                    "/api/v1/transactions/" +
                    result.transaction_id +
                    "/qrcode";
                res.json({ data: __assign(__assign({}, result), { qrCode: url }) });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Add Transaction
router.post("/add", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Create Transaction", "Successfully create transaction"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(addTransactionRules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, transaction, transactionData, result, pay, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(422).json({ errors: errors.array() })];
                transaction = (0, express_validator_1.matchedData)(req);
                transactionData = {
                    payment: transaction.payment,
                    userId: transaction.userId,
                    paymentMethodId: transaction.paymentMethodId,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, transaction_services_1.addTransaction)(transactionData)];
            case 2:
                result = _a.sent();
                return [4 /*yield*/, (0, transaction_services_1.charge)(result)];
            case 3:
                pay = _a.sent();
                res.json({
                    message: "Transaction Success",
                    data: __assign(__assign({}, result.transaction), { details: pay }),
                });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Get QR Code
router.get("/:orderId/qrcode", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, result, img, images, _a, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                orderId = req.params.orderId;
                return [4 /*yield*/, (0, transaction_services_1.getQrCode)(orderId)];
            case 1:
                result = _b.sent();
                return [4 /*yield*/, base64_img_1.default.imgSync(result, "src/assets/images", orderId)];
            case 2:
                img = _b.sent();
                if (!img)
                    return [2 /*return*/, res.status(404).json({ message: "Image not found" })];
                images = fs_1.default.readFileSync(img);
                res.writeHead(200, {
                    "Content-Type": "image/png",
                    "Content-Length": images.length,
                });
                res.end(images);
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                error = new Error("QR Code not found");
                next(error);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Delete Transaction
router.delete("/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Delete Transaction", "Successfully delete transaction"), middlewares_1.isPermited, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, isExist, result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, (0, transaction_services_1.findTransactionById)(id)];
            case 1:
                isExist = _a.sent();
                if (!isExist)
                    return [2 /*return*/, res.status(400).json({ message: "Transaction not found" })];
                return [4 /*yield*/, (0, transaction_services_1.deleteTransaction)(id)];
            case 2:
                result = _a.sent();
                res.json({ message: "Transaction deleted" });
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                next(error_7);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=transaction.routes.js.map