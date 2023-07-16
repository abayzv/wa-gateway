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
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var uuid_1 = require("uuid");
var users_services_1 = require("../users/users.services");
var jwt_1 = require("../../utils/jwt");
var auth_services_1 = require("./auth.services");
var hashToken_1 = require("../../utils/hashToken");
var router = express_1.default.Router();
router.post("/register", (0, middlewares_1.activityLogger)("Register", "New User was registered", false), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, name, roleId, existingUser, user, jti, _b, accessToken, refreshToken, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password, name = _a.name, roleId = _a.roleId;
                if (!email || !password || !name) {
                    res.status(400);
                    throw new Error("You must provide an email, a password and a name.");
                }
                return [4 /*yield*/, (0, users_services_1.findUserByEmail)(email)];
            case 1:
                existingUser = _c.sent();
                if (existingUser) {
                    res.status(409);
                    throw new Error("Email already in use.");
                }
                return [4 /*yield*/, (0, users_services_1.createUserByEmailAndPassword)({
                        email: email,
                        password: password,
                        name: name,
                        roleID: roleId ? roleId : 4,
                    })];
            case 2:
                user = _c.sent();
                jti = (0, uuid_1.v4)();
                _b = (0, jwt_1.generateTokens)(user, jti), accessToken = _b.accessToken, refreshToken = _b.refreshToken;
                return [4 /*yield*/, (0, auth_services_1.addRefreshTokenToWhitelist)({ jti: jti, refreshToken: refreshToken, userId: user.id })];
            case 3:
                _c.sent();
                res.json({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _c.sent();
                next(err_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post("/login", (0, middlewares_1.activityLogger)("Login", "User was logged in", false), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, existingUser, validPassword, jti, _b, accessToken, refreshToken, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    res.status(400);
                    throw new Error("You must provide an email and a password.");
                }
                return [4 /*yield*/, (0, users_services_1.findUserByEmail)(email)];
            case 1:
                existingUser = _c.sent();
                if (!existingUser) {
                    res.status(403);
                    throw new Error("Invalid login credentials.");
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, existingUser.password)];
            case 2:
                validPassword = _c.sent();
                if (!validPassword) {
                    res.status(403);
                    throw new Error("Invalid login credentials.");
                }
                jti = (0, uuid_1.v4)();
                _b = (0, jwt_1.generateTokens)(existingUser, jti), accessToken = _b.accessToken, refreshToken = _b.refreshToken;
                return [4 /*yield*/, (0, auth_services_1.addRefreshTokenToWhitelist)({
                        jti: jti,
                        refreshToken: refreshToken,
                        userId: existingUser.id,
                    })];
            case 3:
                _c.sent();
                res.json({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
                return [3 /*break*/, 5];
            case 4:
                err_2 = _c.sent();
                next(err_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post("/refreshToken", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, payload, savedRefreshToken, hashedToken, user, jti, _a, accessToken, newRefreshToken, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                refreshToken = req.body.refreshToken;
                if (!refreshToken) {
                    res.status(400);
                    throw new Error("Missing refresh token.");
                }
                payload = jsonwebtoken_1.default.verify(refreshToken, 
                //   @ts-ignore
                process.env.JWT_REFRESH_SECRET);
                return [4 /*yield*/, (0, auth_services_1.findRefreshTokenById)(payload.jti)];
            case 1:
                savedRefreshToken = _b.sent();
                if (!savedRefreshToken || savedRefreshToken.revoked === true) {
                    res.status(401);
                    throw new Error("Unauthorized");
                }
                hashedToken = (0, hashToken_1.hashToken)(refreshToken);
                if (hashedToken !== savedRefreshToken.hashedToken) {
                    res.status(401);
                    throw new Error("Unauthorized");
                }
                return [4 /*yield*/, (0, users_services_1.findUserById)(payload.userId)];
            case 2:
                user = _b.sent();
                if (!user) {
                    res.status(401);
                    throw new Error("Unauthorized");
                }
                return [4 /*yield*/, (0, auth_services_1.deleteRefreshToken)(savedRefreshToken.id)];
            case 3:
                _b.sent();
                jti = (0, uuid_1.v4)();
                _a = (0, jwt_1.generateTokens)(user, jti), accessToken = _a.accessToken, newRefreshToken = _a.refreshToken;
                return [4 /*yield*/, (0, auth_services_1.addRefreshTokenToWhitelist)({
                        jti: jti,
                        refreshToken: newRefreshToken,
                        userId: user.id,
                    })];
            case 4:
                _b.sent();
                res.json({
                    accessToken: accessToken,
                    refreshToken: newRefreshToken,
                });
                return [3 /*break*/, 6];
            case 5:
                err_3 = _b.sent();
                next(err_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// This endpoint is only for demo purpose.
// Move this logic where you need to revoke the tokens( for ex, on password reset)
router.post("/revokeRefreshTokens", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = req.body.userId;
                return [4 /*yield*/, (0, users_services_1.findUserById)(userId)];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: "User ID not found" })];
                return [4 /*yield*/, (0, auth_services_1.revokeTokens)(userId)];
            case 2:
                _a.sent();
                res.json({ message: "Tokens revoked for user with id #".concat(userId) });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                next(err_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/logout", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Logout", "User was logged out", true), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.payload.userId;
                return [4 /*yield*/, (0, auth_services_1.revokeTokens)(userId)];
            case 1:
                _a.sent();
                res.json({ message: "Logout Success" });
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=auth.routes.js.map