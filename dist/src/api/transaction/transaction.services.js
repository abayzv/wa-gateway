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
exports.getTransactionById = exports.findTransactionById = exports.deleteTransaction = exports.getQrCode = exports.addTransaction = exports.cancelTransaction = exports.getStatus = exports.charge = exports.getAllTransaction = void 0;
// @ts-ignore
var midtrans_1 = __importDefault(require("../../config/midtrans"));
var axios_1 = __importDefault(require("axios"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var db_1 = require("../../utils/db");
var getAllTransaction = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var paginate, skipData, startDate, endDate, transactions, count, newTransactions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paginate = +query.show || 10;
                skipData = (+query.page - 1) * paginate || 0;
                startDate = new Date("2021-01-01");
                endDate = new Date();
                if (query.startDate) {
                    startDate = new Date(query.startDate);
                }
                if (query.endDate) {
                    endDate = new Date(query.endDate);
                    endDate.setDate(endDate.getDate() + 1);
                }
                return [4 /*yield*/, db_1.db.transaction.findMany({
                        skip: skipData,
                        take: paginate,
                        where: {
                            referenceNumber: {
                                contains: query.referenceId || "",
                                mode: "insensitive",
                            },
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                        select: {
                            id: true,
                            referenceNumber: true,
                            items: {
                                select: {
                                    payment: {
                                        select: {
                                            name: true,
                                            type: true,
                                            amount: true,
                                        },
                                    },
                                },
                            },
                            user: {
                                select: {
                                    profile: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                            paymentMethod: {
                                select: {
                                    name: true,
                                },
                            },
                            status: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    })];
            case 1:
                transactions = _a.sent();
                return [4 /*yield*/, db_1.db.transaction.count({
                        where: {
                            referenceNumber: {
                                contains: query.referenceId || "",
                                mode: "insensitive",
                            },
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    })];
            case 2:
                count = _a.sent();
                newTransactions = transactions.map(function (transaction) {
                    var _a, _b;
                    var total = 0;
                    transaction.items.map(function (item) {
                        total += item.payment.amount;
                    });
                    return {
                        id: transaction.id,
                        referenceNumber: transaction.referenceNumber,
                        user: (_a = transaction.user.profile) === null || _a === void 0 ? void 0 : _a.name,
                        total: total,
                        paymentMethod: (_b = transaction.paymentMethod) === null || _b === void 0 ? void 0 : _b.name,
                        status: transaction.status,
                        createdAt: transaction.createdAt,
                        updatedAt: transaction.updatedAt,
                    };
                });
                return [2 /*return*/, {
                        data: newTransactions,
                        totalPage: Math.ceil(count / paginate).toString(),
                        page: query.page || "1",
                    }];
        }
    });
}); };
exports.getAllTransaction = getAllTransaction;
var getTransactionById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.transaction.findUnique({
                    where: {
                        id: id,
                    },
                    select: {
                        id: true,
                        referenceNumber: true,
                        items: {
                            select: {
                                notes: true,
                                payment: {
                                    select: {
                                        name: true,
                                        type: true,
                                        amount: true,
                                    },
                                },
                            },
                        },
                        user: {
                            select: {
                                profile: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        paymentMethod: {
                            select: {
                                name: true,
                            },
                        },
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                })];
            case 1:
                transaction = _a.sent();
                return [2 /*return*/, transaction];
        }
    });
}); };
exports.getTransactionById = getTransactionById;
var charge = function (paymentData) { return __awaiter(void 0, void 0, void 0, function () {
    var parameter, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                parameter = {
                    payment_type: paymentData.payment_type,
                    transaction_details: {
                        gross_amount: paymentData.gross_amount,
                        order_id: paymentData.order_id,
                    },
                    gopay: {
                        enable_callback: true,
                        callback_url: paymentData.callback_url || "", // optional
                    },
                };
                return [4 /*yield*/, midtrans_1.default.charge(parameter)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.charge = charge;
var getStatus = function (orderId) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.get("https://api.sandbox.midtrans.com/v2/".concat(orderId, "/status"), {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Basic " + btoa(process.env.MIDTRANS_SERVER_KEY + ":"),
                    },
                })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.data];
        }
    });
}); };
exports.getStatus = getStatus;
var cancelTransaction = function (orderId) { return __awaiter(void 0, void 0, void 0, function () {
    var options, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                options = {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                        "content-type": "application/json",
                        Authorization: "Basic " + btoa(process.env.MIDTRANS_SERVER_KEY + ":"),
                    },
                };
                return [4 /*yield*/, (0, node_fetch_1.default)("https://api.sandbox.midtrans.com/v2/".concat(orderId, "/cancel"), options)
                        .then(function (res) { return res.json(); })
                        .then(function (json) { return json; })
                        .catch(function (err) { return err; })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.cancelTransaction = cancelTransaction;
var addTransaction = function (transactionData) { return __awaiter(void 0, void 0, void 0, function () {
    var payment, userId, paymentMethodId, paymentsId, paymentData, totalAmount, generateReferenceNumber, transaction, transactionDetail;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payment = transactionData.payment, userId = transactionData.userId, paymentMethodId = transactionData.paymentMethodId;
                paymentsId = payment.map(function (item) { return item.id; });
                return [4 /*yield*/, db_1.db.payment.findMany({
                        where: {
                            id: {
                                in: paymentsId,
                            },
                        },
                    })];
            case 1:
                paymentData = _a.sent();
                totalAmount = paymentData.reduce(function (acc, curr) { return acc + curr.amount; }, 0);
                generateReferenceNumber = "INV-" +
                    Math.floor(100000 + Math.random() * 900000) +
                    "-" +
                    new Date().toISOString().slice(11, 16).replace(":", "");
                return [4 /*yield*/, db_1.db.transaction.create({
                        data: {
                            referenceNumber: generateReferenceNumber,
                            userId: userId,
                            paymentMethodId: paymentMethodId,
                        },
                        select: {
                            id: true,
                            userId: true,
                            paymentMethod: {
                                select: {
                                    name: true,
                                },
                            },
                            status: true,
                        },
                    })];
            case 2:
                transaction = _a.sent();
                return [4 /*yield*/, db_1.db.transactionDetail.createMany({
                        data: paymentData.map(function (item) {
                            var _a;
                            return ({
                                transactionId: transaction.id,
                                paymentId: item.id,
                                notes: (_a = payment.find(function (payment) { return payment.id === item.id; })) === null || _a === void 0 ? void 0 : _a.notes,
                            });
                        }),
                        skipDuplicates: true,
                    })];
            case 3:
                transactionDetail = _a.sent();
                return [2 /*return*/, {
                        payment_type: transaction.paymentMethod.name,
                        gross_amount: totalAmount,
                        order_id: transaction.id,
                        transaction: transaction,
                    }];
        }
    });
}); };
exports.addTransaction = addTransaction;
var getQrCode = function (orderId) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default
                    .get("https://api.sandbox.midtrans.com/v2/qris/".concat(orderId, "/qr-code"), {
                    responseType: "arraybuffer",
                })
                    .then(function (response) {
                    var image = btoa(new Uint8Array(response.data).reduce(function (data, byte) { return data + String.fromCharCode(byte); }, ""));
                    return "data:".concat(response.headers["content-type"].toLowerCase(), ";base64,").concat(image);
                })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.getQrCode = getQrCode;
var findTransactionById = function (transactionId) { return __awaiter(void 0, void 0, void 0, function () {
    var transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.transaction.findUnique({
                    where: {
                        id: transactionId,
                    },
                })];
            case 1:
                transaction = _a.sent();
                return [2 /*return*/, transaction];
        }
    });
}); };
exports.findTransactionById = findTransactionById;
var deleteTransaction = function (transactionId) { return __awaiter(void 0, void 0, void 0, function () {
    var transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.transaction.delete({
                    where: {
                        id: transactionId,
                    },
                })];
            case 1:
                transaction = _a.sent();
                return [2 /*return*/, transaction];
        }
    });
}); };
exports.deleteTransaction = deleteTransaction;
//# sourceMappingURL=transaction.services.js.map