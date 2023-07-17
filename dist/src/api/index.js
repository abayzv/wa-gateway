"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// @ts-ignore
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("../config/swagger");
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const users_routes_1 = __importDefault(require("./users/users.routes"));
const role_routes_1 = __importDefault(require("./role/role.routes"));
const permission_routes_1 = __importDefault(require("./permission/permission.routes"));
const whatsapp_routes_1 = __importDefault(require("./whatsapp/whatsapp.routes"));
const contact_routes_1 = __importDefault(require("./contact/contact.routes"));
const contactGroup_routes_1 = __importDefault(require("./contactGroup/contactGroup.routes"));
const broadcast_routes_1 = __importDefault(require("./broadcast/broadcast.routes"));
const router = express_1.default.Router();
router.use("/auth", auth_routes_1.default);
router.use("/users", users_routes_1.default);
router.use("/roles", role_routes_1.default);
router.use("/permissions", permission_routes_1.default);
router.use("/wa-gateway", whatsapp_routes_1.default);
router.use("/contacts", contact_routes_1.default);
router.use("/contact-groups", contactGroup_routes_1.default);
router.use("/message-log", broadcast_routes_1.default);
// Swagger setup
// swagger
router.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerConfig));
exports.default = router;
//# sourceMappingURL=index.js.map