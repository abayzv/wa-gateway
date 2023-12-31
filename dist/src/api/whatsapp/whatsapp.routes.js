"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const whatsapp_services_1 = __importDefault(require("./whatsapp.services"));
const qrcode_1 = __importDefault(require("qrcode"));
const middlewares_1 = require("../../middlewares");
const broadcast_services_1 = require("../broadcast/broadcast.services");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
let session = [];
router.get("/connect/:user", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const { user } = req.params;
    // check if user allready connect to server
    const isUser = session.find((item) => item.user === user);
    if (isUser)
        return res.json({
            message: "User allready connect to server",
        });
    const client = new whatsapp_services_1.default();
    try {
        const status = await client.connect(user);
        const number = await client.profile.id;
        const data = { user, number, client };
        session.push(data);
        res.json({
            message: "Success connect to server",
            data: { user: data.user, number: data.number },
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/qr-code/:user", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const { user } = req.params;
    const isUser = session.find((item) => item.user === user);
    if (!isUser)
        return res.json({
            message: "User not found, please connect to server first",
        });
    if (!isUser.client.qrCode)
        return res.json({
            message: "Please start server before use the QrCode",
        });
    // @ts-ignore
    const qrCode = await qrcode_1.default.toDataURL(isUser.client.qrCode);
    try {
        res.json({ qrCode });
    }
    catch (error) {
        next(error);
    }
});
// get status
router.get("/status/:user", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const { user } = req.params;
    const isUser = session.find((item) => item.user === user);
    if (!isUser)
        return res.json({
            message: "User not found, please connect to server first",
        });
    if (isUser.client.status === "open")
        return res.json({
            qrCode: "Device allready connect to server",
            status: isUser.client.status,
        });
    if (isUser.client.status === "close") {
        // delete session
        const index = session.findIndex((item) => item.user === user);
        session.splice(index, 1);
        // reconnect
        const client = new whatsapp_services_1.default();
        try {
            const status = await client.connect(user);
            const number = await client.profile.id;
            const data = { user, number, client };
            session.push(data);
            if (number) {
                return res.json({
                    qrCode: "Device allready connect to server",
                    status: client.status,
                });
            }
        }
        catch (error) {
            next(error);
        }
    }
    // @ts-ignore
    const qrCode = await qrcode_1.default.toDataURL(isUser.client.status);
    try {
        res.json({ qrcode: qrCode, status: isUser.client.status });
    }
    catch (error) {
        next(error);
    }
});
// send message
router.post("/send-message/:user", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const { number, message } = req.body;
    const { user } = req.params;
    const isUser = session.find((item) => item.user === user);
    if (!isUser)
        return res.json({
            message: "User not found, please connect to server first",
        });
    if (!number || !message)
        return res.json({ message: "Please provide number and message" });
    try {
        const sentMsg = await isUser.client.sendMessage(number, message);
        const broadcastData = {
            user: req.payload.userId,
            title: "Send Message",
            number: number,
            type: client_1.BroadcastType.TEXT,
            status: "success",
            message: message,
        };
        await (0, broadcast_services_1.createBroadcast)(broadcastData);
        res.json({ message: sentMsg });
    }
    catch (error) {
        const broadcastData = {
            user: req.payload.userId,
            title: "Send Message",
            number: number,
            type: client_1.BroadcastType.TEXT,
            status: "failed",
            message: message,
        };
        await (0, broadcast_services_1.createBroadcast)(broadcastData);
        next(error);
    }
});
// send template message
router.post("/send-template-message/:user", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const { number, message, list } = req.body;
    const { user } = req.params;
    const isUser = session.find((item) => item.user === user);
    if (!isUser)
        return res.json({
            message: "User not found, please connect to server first",
        });
    if (!number || !message || !list)
        return res.json({ message: "Please provide number, message and list" });
    try {
        const sentMsg = await isUser.client.sendTemplateMessage(number, message, list);
        const broadcastData = {
            user: req.payload.userId,
            title: "Send Template Message",
            number: number,
            type: client_1.BroadcastType.TEMPLATE,
            status: "success",
            message: message,
        };
        await (0, broadcast_services_1.createBroadcast)(broadcastData);
        res.json({ message: sentMsg });
    }
    catch (error) {
        const broadcastData = {
            user: req.payload.userId,
            title: "Send Template Message",
            number: number,
            type: client_1.BroadcastType.TEMPLATE,
            status: "failed",
            message: message,
        };
        await (0, broadcast_services_1.createBroadcast)(broadcastData);
        next(error);
    }
});
// send template message
router.post("/send-image/:user", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const { number, message, imageUrl } = req.body;
    const { user } = req.params;
    const isUser = session.find((item) => item.user === user);
    if (!isUser)
        return res.json({
            message: "User not found, please connect to server first",
        });
    if (!number || !message || !imageUrl)
        return res.json({
            message: "Please provide number and message and imageUrl",
        });
    try {
        const sentMsg = await isUser.client.sendImage(number, message, imageUrl);
        const broadcastData = {
            user: req.payload.userId,
            title: "Send Image",
            number: number,
            type: client_1.BroadcastType.MEDIA,
            status: "success",
            message: message,
            imageUrl: imageUrl,
        };
        await (0, broadcast_services_1.createBroadcast)(broadcastData);
        res.json({ message: sentMsg });
    }
    catch (error) {
        const broadcastData = {
            user: req.payload.userId,
            title: "Send Image",
            number: number,
            type: client_1.BroadcastType.MEDIA,
            status: "failed",
            message: message,
            imageUrl: imageUrl,
        };
        await (0, broadcast_services_1.createBroadcast)(broadcastData);
        next(error);
    }
});
// logout
router.get("/logout/:user", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const { user } = req.params;
    const isUser = session.find((item) => item.user === user);
    if (!isUser)
        return res.json({
            message: "User not found, please connect to server first",
        });
    try {
        const index = session.findIndex((item) => item.user === user);
        const wa = session[index];
        const { isLogout } = await wa.client.logout();
        if (!isLogout)
            return res.json({ message: "Failed logout" });
        session.splice(index, 1);
        res.json({ message: "Success logout" });
    }
    catch (error) {
        next(error);
    }
});
// get session
router.get("/session", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    try {
        res.json({ session });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=whatsapp.routes.js.map