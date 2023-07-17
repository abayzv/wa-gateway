"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateAccessToken(user) {
    const data = { userId: user.id, role: user.roleID };
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
        jti,
    }, 
    // @ts-ignore
    process.env.JWT_REFRESH_SECRET, {
        expiresIn: "4h",
    });
}
exports.generateRefreshToken = generateRefreshToken;
function generateTokens(user, jti) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jti);
    return {
        accessToken,
        refreshToken,
    };
}
exports.generateTokens = generateTokens;
//# sourceMappingURL=jwt.js.map