"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = exports.generateRefreshToken = exports.generateAccessToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateAccessToken(user) {
    var data = { userId: user.id, role: user.roleID };
    // @ts-ignore
    return jsonwebtoken_1.default.sign(data, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "1h",
    });
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken(user, jti) {
    return jsonwebtoken_1.default.sign({
        userId: user.id,
        roleID: user.roleID,
        jti: jti,
    }, 
    // @ts-ignore
    process.env.JWT_REFRESH_SECRET, {
        expiresIn: "4h",
    });
}
exports.generateRefreshToken = generateRefreshToken;
function generateTokens(user, jti) {
    var accessToken = generateAccessToken(user);
    var refreshToken = generateRefreshToken(user, jti);
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
}
exports.generateTokens = generateTokens;
//# sourceMappingURL=jwt.js.map