"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../../middlewares");
const contactGroup_services_1 = require("./contactGroup.services");
const router = express_1.default.Router();
const rules = {
    name: {
        isString: true,
        isLength: {
            options: { min: 3 },
            errorMessage: "Name must be at least 3 characters long",
        },
    },
    description: {
        isString: true,
        isLength: {
            options: { min: 3 },
            errorMessage: "Description must be at least 3 characters long",
        },
    },
};
// View All Contact Groups
router.get("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const query = {
        name: req.query.name,
        page: req.query.page,
        show: req.query.show,
    };
    const userId = req.payload.userId;
    try {
        const data = await (0, contactGroup_services_1.viewAllContactGroups)(query, userId);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
// Add Contact Group
router.post("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json(errors);
        }
        const data = (0, express_validator_1.matchedData)(req);
        const isExist = await (0, contactGroup_services_1.findContactGrupByName)(data.name);
        if (isExist)
            return res.status(422).json({ message: "Contact group already exist" });
        const contactGroupData = {
            user: req.payload.userId,
            name: data.name,
            description: data.description,
        };
        const contactGroup = await (0, contactGroup_services_1.addContactGroup)(contactGroupData);
        res.json(contactGroup);
    }
    catch (error) {
        next(error);
    }
});
// Delete Contact Group
router.delete("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const contactGroup = await (0, contactGroup_services_1.findContactGroupById)(req.params.id);
    if (!contactGroup)
        return res.status(404).json({ message: "Contact group not found" });
    try {
        const data = await (0, contactGroup_services_1.deleteContactGroup)(req.params.id);
        res.json({ message: "Contact group deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=contactGroup.routes.js.map