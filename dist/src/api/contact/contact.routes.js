"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../../middlewares");
const contact_services_1 = require("./contact.services");
const router = express_1.default.Router();
// Validation Rules
const rules = {
    name: {
        notEmpty: {
            errorMessage: "Name is required",
        },
        isLength: {
            options: { min: 3 },
            errorMessage: "Name must be at least 3 characters long",
        },
    },
    phoneNumber: {
        notEmpty: {
            errorMessage: "Phone is required",
        },
        isLength: {
            options: { min: 10 },
            errorMessage: "Phone must be at least 10 characters long",
        },
        // custom validator, phone must start with 62
        custom: {
            options: (value) => {
                return value.startsWith("62");
            },
            errorMessage: "Phone must start with 62",
        },
    },
};
const editRules = {
    name: {
        optional: true,
        isLength: {
            options: { min: 3 },
            errorMessage: "Name must be at least 3 characters long",
        },
    },
    phoneNumber: {
        optional: true,
        isLength: {
            options: { min: 10 },
            errorMessage: "Phone must be at least 10 characters long",
        },
        // custom validator, phone must start with 62
        custom: {
            options: (value) => {
                return value.startsWith("62");
            },
        },
    },
};
// View All Contacts
router.get("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const query = {
        name: req.query.name,
        page: req.query.page,
        show: req.query.show,
    };
    const userId = req.payload.userId;
    try {
        const data = await (0, contact_services_1.viewAllContacts)(query, userId);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
// View Contact
router.get("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    try {
        const data = await (0, contact_services_1.viewContact)(req.params.id);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
// Create Contact
router.post("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), async (req, res, next) => {
    // get user auth id
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json(errors);
        }
        const data = (0, express_validator_1.matchedData)(req);
        const isExist = await (0, contact_services_1.findContactByName)(data.name);
        if (isExist)
            return res.status(422).json({ message: "Contact already exist" });
        const contactData = {
            user: req.payload.userId,
            name: data.name,
            phoneNumber: data.phoneNumber,
            group: data.group,
        };
        const contact = await (0, contact_services_1.createContact)(contactData);
        res.json(contact);
    }
    catch (error) {
        next(error);
    }
});
// delete Contact
router.delete("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const isExist = await (0, contact_services_1.viewContact)(req.params.id);
    if (!isExist)
        return res.status(404).json({ message: "Contact not found" });
    try {
        const data = await (0, contact_services_1.deleteContact)(req.params.id);
        res.json({
            message: "Contact deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=contact.routes.js.map