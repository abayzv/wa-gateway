"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../../middlewares");
const broadcast_services_1 = require("./broadcast.services");
const router = express_1.default.Router();
router.get("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const query = {
        name: req.query.name,
        page: req.query.page,
        show: req.query.show,
    };
    const userId = req.payload.userId;
    try {
        const data = await (0, broadcast_services_1.viewAllBroadcasts)(query, userId);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=broadcast.routes.js.map