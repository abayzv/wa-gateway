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
exports.activityLogger = exports.isPermited = exports.isAuthenticated = exports.errorHandler = exports.notFound = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var db_1 = require("./utils/db");
var auth_services_1 = require("./api/auth/auth.services");
function isPermited(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var role, path, isPermited, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    role = req.payload.role;
                    path = req.originalUrl.split("/").slice(3, 5).join("/");
                    if (role === 1)
                        return [2 /*return*/, next()];
                    return [4 /*yield*/, db_1.db.role.findMany({
                            where: {
                                id: role,
                                permissions: {
                                    some: {
                                        permission: {
                                            action: req.method,
                                            menu: {
                                                contains: path,
                                                mode: "insensitive",
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                case 1:
                    isPermited = _a.sent();
                    if (!isPermited.length) {
                        res.status(403);
                        error = new Error("You are not permited to access this route");
                        res.json({
                            message: error.message,
                        });
                    }
                    else {
                        return [2 /*return*/, next()];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.isPermited = isPermited;
function notFound(req, res, next) {
    res.status(404);
    var error = new Error("Url Not Found ".concat(req.originalUrl));
    res.json({
        message: error.message,
        // stack: process.env.NODE_ENV === "production" ? "" : error.stack,
    });
}
exports.notFound = notFound;
// eslint-disable no-unused-vars /
function errorHandler(err, req, res, next) {
    // eslint-enable no-unused-vars /
    var statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        // stack: process.env.NODE_ENV === "production" ? "" : err.stack,
    });
}
exports.errorHandler = errorHandler;
function activityLogger(action, description, useAuth) {
    if (useAuth === void 0) { useAuth = true; }
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var ipAddress, user, userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                        if (!(!useAuth && res.statusCode === 200)) return [3 /*break*/, 3];
                        return [4 /*yield*/, db_1.db.user.findFirst({
                                where: {
                                    email: req.body.email,
                                },
                            })];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, db_1.db.activityLog.create({
                                data: {
                                    action: action,
                                    description: description,
                                    // @ts-ignore
                                    ipAddress: ipAddress,
                                    // @ts-ignore
                                    userId: user.id,
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, next()];
                    case 3:
                        userId = req.payload.userId;
                        return [4 /*yield*/, db_1.db.activityLog.create({
                                data: {
                                    action: action,
                                    description: description,
                                    // @ts-ignore
                                    ipAddress: ipAddress,
                                    // @ts-ignore
                                    userId: userId,
                                },
                            })];
                    case 4:
                        _a.sent();
                        next();
                        return [2 /*return*/];
                }
            });
        });
    };
}
exports.activityLogger = activityLogger;
function isAuthenticated(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var authorization, token, payload, userId, activeRefreshToken, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authorization = req.headers.authorization;
                    if (!authorization)
                        return [2 /*return*/, res.status(401).json({ message: "Un-Authorized" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    token = authorization.split(" ")[1];
                    payload = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
                    req.payload = payload;
                    userId = payload.userId;
                    return [4 /*yield*/, (0, auth_services_1.findRefreshTokenByUserId)(userId)];
                case 2:
                    activeRefreshToken = _a.sent();
                    if (!activeRefreshToken)
                        return [2 /*return*/, res.status(401).json({ message: "Un-Authorized" })];
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    res.status(401);
                    if (err_1.name === "TokenExpiredError") {
                        next(new Error("Token Expired"));
                    }
                    next(new Error("Un-Authorized"));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, next()];
            }
        });
    });
}
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=middlewares.js.map