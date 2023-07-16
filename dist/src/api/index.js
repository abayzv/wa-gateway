"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
// @ts-ignore
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swagger_1 = require("../config/swagger");
var auth_routes_1 = __importDefault(require("./auth/auth.routes"));
var users_routes_1 = __importDefault(require("./users/users.routes"));
var role_routes_1 = __importDefault(require("./role/role.routes"));
var permission_routes_1 = __importDefault(require("./permission/permission.routes"));
var transaction_routes_1 = __importDefault(require("./transaction/transaction.routes"));
var payment_routes_1 = __importDefault(require("./payment/payment.routes"));
var log_routes_1 = __importDefault(require("./log/log.routes"));
var classroom_routes_1 = __importDefault(require("./classroom/classroom.routes"));
var list_routes_1 = __importDefault(require("./list/list.routes"));
var subject_routes_1 = __importDefault(require("./subject/subject.routes"));
var score_routes_1 = __importDefault(require("./score/score.routes"));
var scoreCategory_routes_1 = __importDefault(require("./scoreCategory/scoreCategory.routes"));
var router = express_1.default.Router();
router.use("/auth", auth_routes_1.default);
router.use("/users", users_routes_1.default);
router.use("/roles", role_routes_1.default);
router.use("/permissions", permission_routes_1.default);
router.use("/transactions", transaction_routes_1.default);
router.use("/payments", payment_routes_1.default);
router.use("/logs", log_routes_1.default);
router.use("/classrooms", classroom_routes_1.default);
router.use("/list", list_routes_1.default);
router.use("/subjects", subject_routes_1.default);
router.use("/scores", score_routes_1.default);
router.use("/score-categories", scoreCategory_routes_1.default);
// Swagger setup
// swagger
router.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerConfig));
exports.default = router;
//# sourceMappingURL=index.js.map