"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const log_services_1 = require("./log.services");
const middlewares_1 = require("../../middlewares");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Validation Rules
const rules = {
    name: {
        optional: true,
    },
    action: {
        optional: true,
    },
    startDate: {
        optional: true,
        isDate: {
            errorMessage: "Start Date must be a valid date",
        },
    },
    endDate: {
        optional: true,
        isDate: {
            errorMessage: "End Date must be a valid date",
        },
    },
};
// Get all logs
router.get("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(422).json(errors.array());
    const { name, action, startDate, endDate } = (0, express_validator_1.matchedData)(req, {
        locations: ["query"],
    });
    const query = {
        name,
        action,
        startDate,
        endDate,
        page: req.query.page,
        show: req.query.show,
    };
    try {
        const logs = await (0, log_services_1.getAllLog)(query);
        res.json(logs);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=log.routes.js.map