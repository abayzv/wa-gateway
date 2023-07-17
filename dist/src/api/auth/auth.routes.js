"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../../middlewares");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const users_services_1 = require("../users/users.services");
const jwt_1 = require("../../utils/jwt");
const auth_services_1 = require("./auth.services");
const hashToken_1 = require("../../utils/hashToken");
const router = express_1.default.Router();
router.post("/register", (0, middlewares_1.activityLogger)("Register", "New User was registered", false), async (req, res, next) => {
    try {
        const { email, password, name, roleId } = req.body;
        if (!email || !password || !name) {
            res.status(400);
            throw new Error("You must provide an email, a password and a name.");
        }
        const existingUser = await (0, users_services_1.findUserByEmail)(email);
        if (existingUser) {
            res.status(409);
            throw new Error("Email already in use.");
        }
        const user = await (0, users_services_1.createUserByEmailAndPassword)({
            email,
            password,
            name,
            roleID: roleId ? roleId : 3,
        });
        const jti = (0, uuid_1.v4)();
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user, jti);
        await (0, auth_services_1.addRefreshTokenToWhitelist)({ jti, refreshToken, userId: user.id });
        res.json({
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        next(err);
    }
});
router.post("/login", (0, middlewares_1.activityLogger)("Login", "User was logged in", false), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error("You must provide an email and a password.");
        }
        const existingUser = await (0, users_services_1.findUserByEmail)(email);
        if (!existingUser) {
            res.status(403);
            throw new Error("Invalid login credentials.");
        }
        const validPassword = await bcrypt_1.default.compare(password, existingUser.password);
        if (!validPassword) {
            res.status(403);
            throw new Error("Invalid login credentials.");
        }
        const jti = (0, uuid_1.v4)();
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(existingUser, jti);
        await (0, auth_services_1.addRefreshTokenToWhitelist)({
            jti,
            refreshToken,
            userId: existingUser.id,
        });
        res.json({
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        next(err);
    }
});
router.post("/refreshToken", async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400);
            throw new Error("Missing refresh token.");
        }
        const payload = jsonwebtoken_1.default.verify(refreshToken, 
        //   @ts-ignore
        process.env.JWT_REFRESH_SECRET);
        const savedRefreshToken = await (0, auth_services_1.findRefreshTokenById)(payload.jti);
        if (!savedRefreshToken || savedRefreshToken.revoked === true) {
            res.status(401);
            throw new Error("Unauthorized");
        }
        const hashedToken = (0, hashToken_1.hashToken)(refreshToken);
        if (hashedToken !== savedRefreshToken.hashedToken) {
            res.status(401);
            throw new Error("Unauthorized");
        }
        const user = await (0, users_services_1.findUserById)(payload.userId);
        if (!user) {
            res.status(401);
            throw new Error("Unauthorized");
        }
        await (0, auth_services_1.deleteRefreshToken)(savedRefreshToken.id);
        const jti = (0, uuid_1.v4)();
        const { accessToken, refreshToken: newRefreshToken } = (0, jwt_1.generateTokens)(user, jti);
        await (0, auth_services_1.addRefreshTokenToWhitelist)({
            jti,
            refreshToken: newRefreshToken,
            userId: user.id,
        });
        res.json({
            accessToken,
            refreshToken: newRefreshToken,
        });
    }
    catch (err) {
        next(err);
    }
});
// This endpoint is only for demo purpose.
// Move this logic where you need to revoke the tokens( for ex, on password reset)
router.post("/revokeRefreshTokens", async (req, res, next) => {
    try {
        const { userId } = req.body;
        const user = await (0, users_services_1.findUserById)(userId);
        if (!user)
            return res.status(404).json({ message: `User ID not found` });
        await (0, auth_services_1.revokeTokens)(userId);
        res.json({ message: `Tokens revoked for user with id #${userId}` });
    }
    catch (err) {
        next(err);
    }
});
router.post("/logout", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Logout", "User was logged out", true), async (req, res, next) => {
    const { userId } = req.payload;
    await (0, auth_services_1.revokeTokens)(userId);
    res.json({ message: "Logout Success" });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map