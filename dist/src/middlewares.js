"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogger = exports.isPermited = exports.isAuthenticated = exports.errorHandler = exports.notFound = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./utils/db");
const auth_services_1 = require("./api/auth/auth.services");
async function isPermited(req, res, next) {
    const { role } = req.payload;
    const path = req.originalUrl.split("/").slice(3, 5).join("/");
    if (role === 1)
        return next();
    const isPermited = await db_1.db.role.findMany({
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
    });
    if (!isPermited.length) {
        res.status(403);
        const error = new Error("You are not permited to access this route");
        res.json({
            message: error.message,
        });
    }
    else {
        return next();
    }
}
exports.isPermited = isPermited;
function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`Url Not Found ${req.originalUrl}`);
    res.json({
        message: error.message,
        // stack: process.env.NODE_ENV === "production" ? "" : error.stack,
    });
}
exports.notFound = notFound;
// eslint-disable no-unused-vars /
function errorHandler(err, req, res, next) {
    // eslint-enable no-unused-vars /
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        // stack: process.env.NODE_ENV === "production" ? "" : err.stack,
    });
}
exports.errorHandler = errorHandler;
function activityLogger(action, description, useAuth = true) {
    return async function (req, res, next) {
        const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        if (!useAuth && res.statusCode === 200) {
            const user = await db_1.db.user.findFirst({
                where: {
                    email: req.body.email,
                },
            });
            await db_1.db.activityLog.create({
                data: {
                    action,
                    description,
                    // @ts-ignore
                    ipAddress,
                    // @ts-ignore
                    userId: user.id,
                },
            });
            return next();
        }
        const { userId } = req.payload;
        await db_1.db.activityLog.create({
            data: {
                action,
                description,
                // @ts-ignore
                ipAddress,
                // @ts-ignore
                userId: userId,
            },
        });
        next();
    };
}
exports.activityLogger = activityLogger;
async function isAuthenticated(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(401).json({ message: "Un-Authorized" });
    try {
        const token = authorization.split(" ")[1];
        // @ts-ignore
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        req.payload = payload;
        const { userId } = payload;
        const activeRefreshToken = await (0, auth_services_1.findRefreshTokenByUserId)(userId);
        if (!activeRefreshToken)
            return res.status(401).json({ message: "Un-Authorized" });
    }
    catch (err) {
        res.status(401);
        if (err.name === "TokenExpiredError") {
            next(new Error("Token Expired"));
        }
        next(new Error("Un-Authorized"));
    }
    return next();
}
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=middlewares.js.map