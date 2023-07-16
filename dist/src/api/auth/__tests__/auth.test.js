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
var app_1 = __importDefault(require("../../../app"));
var supertest_1 = __importDefault(require("supertest"));
var db_1 = require("../../../utils/db");
var token = "";
var refreshToken = "";
var testEmail = "test@test.com";
// Login Test
describe("POST /api/v1/auth/login", function () {
    it("should return 400 if email or password is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post("/api/v1/auth/login").send({
                        email: "admin@admin.com",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(400);
                    expect(response.body.message).toBe("You must provide an email and a password.");
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return 403 if email or password is invalid", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post("/api/v1/auth/login").send({
                        email: "test@test.com",
                        password: "test",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(403);
                    expect(response.body.message).toBe("Invalid login credentials.");
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return 200 if email and password are valid", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post("/api/v1/auth/login").send({
                        email: "admin@admin.com",
                        password: "P@ssw0rd",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body).toHaveProperty("accessToken");
                    expect(response.body).toHaveProperty("refreshToken");
                    token = response.body.accessToken;
                    refreshToken = response.body.refreshToken;
                    return [2 /*return*/];
            }
        });
    }); });
});
// Register Test
describe("POST /api/v1/auth/register", function () {
    it("should return 400 if email, password or name is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post("/api/v1/auth/register").send({
                        email: "",
                        password: "",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(400);
                    expect(response.body.message).toBe("You must provide an email, a password and a name.");
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return 409 if email already exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post("/api/v1/auth/register").send({
                        email: "admin@admin.com",
                        password: "P@ssw0rd",
                        name: "Test User",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(409);
                    expect(response.body.message).toBe("Email already in use.");
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return 200 if email, password and name are valid", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post("/api/v1/auth/register").send({
                        email: testEmail,
                        password: "P@ssw0rd",
                        name: "Test User",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body).toHaveProperty("accessToken");
                    expect(response.body).toHaveProperty("refreshToken");
                    return [2 /*return*/];
            }
        });
    }); });
});
// Refresh Token Test
describe("POST /api/v1/auth/refreshToken", function () {
    it("should return 400 if refreshToken is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post("/api/v1/auth/refreshToken").send({
                        refreshToken: "",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(400);
                    expect(response.body.message).toBe("Missing refresh token.");
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return 200 if refreshToken is valid", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post("/api/v1/auth/refreshToken").send({
                        refreshToken: refreshToken,
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body).toHaveProperty("accessToken");
                    expect(response.body).toHaveProperty("refreshToken");
                    return [2 /*return*/];
            }
        });
    }); });
});
// revoke token
describe("POST /api/v1/auth/revokeRefreshTokens", function () {
    it("should user id not found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post("/api/v1/auth/revokeRefreshTokens")
                        .send({
                        userId: "123456789",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(404);
                    expect(response.body.message).toBe("User ID not found");
                    return [2 /*return*/];
            }
        });
    }); });
});
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.user.delete({
                    where: {
                        email: testEmail,
                    },
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=auth.test.js.map