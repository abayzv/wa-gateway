"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../../middlewares");
const permission_services_1 = require("./permission.services");
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
    action: {
        notEmpty: {
            errorMessage: "Action is required",
        },
        isIn: {
            options: [["GET", "POST", "PUT", "DELETE"]],
            errorMessage: "Action must be GET, POST, PUT or DELETE",
        },
    },
    menu: {
        notEmpty: {
            errorMessage: "Menu is required",
        },
        isLength: {
            options: { min: 3 },
            errorMessage: "Menu must be at least 3 characters long",
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
    action: {
        optional: true,
        isLength: {
            options: { min: 3 },
            errorMessage: "Name must be at least 3 characters long",
        },
        isIn: {
            options: [["GET", "POST", "PUT", "DELETE"]],
            errorMessage: "Action must be GET, POST, PUT or DELETE",
        },
    },
    menu: {
        optional: true,
        isLength: {
            options: { min: 3 },
            errorMessage: "Name must be at least 3 characters long",
        },
    },
};
// Vie All Permissions
router.get("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    try {
        const query = {
            name: req.query.name,
            page: req.query.page,
            show: req.query.show,
        };
        const permissions = await (0, permission_services_1.viewAllPermissions)(query);
        res.json(permissions);
    }
    catch (error) {
        next(error);
    }
});
// Create Permission
router.post("/", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Create Permission", "Successfully create permission"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), async (req, res, next) => {
    // init validation
    const errors = (0, express_validator_1.validationResult)(req);
    // if not valid return error
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    // if valid get data
    const { name, action, menu } = (0, express_validator_1.matchedData)(req);
    const permissionData = { name, action, menu };
    //   check if role already exist
    const isExist = await (0, permission_services_1.findPermissionByName)(name);
    if (isExist)
        return res.status(400).json({ message: "Permission already exist" });
    //  create role
    try {
        const permission = await (0, permission_services_1.createPermission)(permissionData);
        res.json({ message: "Permission created", data: permission });
    }
    catch (error) {
        next(error);
    }
});
// Update Permission
router.put("/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Update Permission", "Successfully update permission"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(editRules), async (req, res, next) => {
    const id = +req.params.id;
    // init validation
    const errors = (0, express_validator_1.validationResult)(req);
    // if not valid return error
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    // if valid get data
    const { name, action, menu } = (0, express_validator_1.matchedData)(req);
    const permissionData = { name, action, menu };
    // check if permission exist
    const permission = await (0, permission_services_1.findPermissionById)(id);
    if (!permission)
        return res.status(400).json({ message: "Permission not found" });
    //   check if permission already exist
    const isExist = await (0, permission_services_1.findPermissionByName)(name);
    if (name && isExist)
        return res.status(400).json({ message: "Permission already exist" });
    //  update permission
    try {
        const permission = await (0, permission_services_1.updatePermission)({
            permissionId: id,
            permission: permissionData,
        });
        res.json({ message: "Permission updated", data: permission });
    }
    catch (error) {
        next(error);
    }
});
// Delete Permission
router.delete("/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Delete Permission", "Successfully delete permission"), middlewares_1.isPermited, async (req, res, next) => {
    const id = +req.params.id;
    // check if permission exist
    const permission = await (0, permission_services_1.findPermissionById)(id);
    if (!permission)
        return res.status(400).json({ message: "Permission not found" });
    //  delete permission
    try {
        await (0, permission_services_1.deletePermission)(id);
        res.json({ message: "Permission deleted" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=permission.routes.js.map