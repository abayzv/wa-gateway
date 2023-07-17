"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../../middlewares");
const role_services_1 = require("./role.services");
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
};
// Assign Role Permission Rules
const rolePermissionRules = {
    permissions: {
        isArray: {
            errorMessage: "Permission must be an array",
        },
        notEmpty: {
            errorMessage: "Permission is required",
        },
    },
};
// Vie All Roles
router.get("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    try {
        const query = {
            name: req.query.name,
            page: req.query.page,
            show: req.query.show,
        };
        const roles = await (0, role_services_1.viewAllRoles)(query);
        res.json(roles);
    }
    catch (error) {
        next(error);
    }
});
// View Role Detail
router.get("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const id = +req.params.id;
    // check if role exist
    const role = await (0, role_services_1.findRoleById)(id);
    if (!role)
        return res.status(400).json({ message: "Role not found" });
    try {
        const roles = await (0, role_services_1.findRoleById)(id);
        res.json({ data: roles });
    }
    catch (error) {
        next(error);
    }
});
// Create Role
router.post("/", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Create Role", "Successfully create role"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), async (req, res, next) => {
    // init validation
    const errors = (0, express_validator_1.validationResult)(req);
    // if not valid return error
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    // if valid get data
    const { name } = (0, express_validator_1.matchedData)(req);
    const roleData = {
        name,
    };
    //   check if role already exist
    const isExist = await (0, role_services_1.findRoleByName)(name);
    if (isExist)
        return res.status(400).json({ message: "Role already exist" });
    //  create role
    try {
        const roles = await (0, role_services_1.createRole)(roleData);
        res.json({ message: "Role successfully created", data: roles });
    }
    catch (error) {
        next(error);
    }
});
// Update Role
router.put("/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Update Role", "Successfully update role"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    const id = +req.params.id;
    // if not valid return error
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    // if valid get data
    const { name } = (0, express_validator_1.matchedData)(req);
    const roleData = {
        id,
        name,
    };
    //   check if role already exist
    const isExist = await (0, role_services_1.findRoleByName)(name);
    if (isExist)
        return res.status(400).json({ message: "Role already exist" });
    // update role
    try {
        const roles = await (0, role_services_1.updateRole)(roleData);
        res.json({ message: "Role successfully updated", data: roles });
    }
    catch (error) {
        next(error);
    }
});
// Delete Role
router.delete("/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Delete Role", "Successfully delete role"), middlewares_1.isPermited, async (req, res, next) => {
    const id = +req.params.id;
    // check if role exist
    const role = await (0, role_services_1.findRoleById)(id);
    if (!role)
        return res.status(400).json({ message: "Role not found" });
    try {
        const roles = await (0, role_services_1.deleteRole)(id);
        res.json({ message: "Role successfully deleted" });
    }
    catch (error) {
        next(error);
    }
});
// Assign Role Permission
router.post("/assign/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Assign Role Permission", "Successfully assign permission"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rolePermissionRules), async (req, res, next) => {
    const id = +req.params.id;
    // init validation
    const errors = (0, express_validator_1.validationResult)(req);
    // if not valid return error
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    // check if role exist
    const role = await (0, role_services_1.findRoleById)(id);
    if (!role)
        return res.status(400).json({ message: "Role not found" });
    // get permission
    const permissions = (0, express_validator_1.matchedData)(req).permissions;
    // map role id to permission
    const mappedPermission = permissions.map((permission) => {
        return {
            roleId: id,
            permissionId: permission,
        };
    });
    const isExist = await (0, role_services_1.isRolePermissionExist)(mappedPermission);
    if (isExist)
        return res.status(400).json({
            message: "Permission already assigned, please change to another permission",
            data: isExist.map((item) => {
                return {
                    name: item.permission.name,
                };
            }),
        });
    // assign permission
    try {
        await (0, role_services_1.assignRolePermission)(mappedPermission);
        res.json({ message: "Permission successfully assigned" });
    }
    catch (error) {
        next(error);
    }
});
// Unassign Role Permission
router.delete("/unassign/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Unassign Role Permission", "Successfully unassign permission"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rolePermissionRules), async (req, res, next) => {
    const id = +req.params.id;
    // init validation
    const errors = (0, express_validator_1.validationResult)(req);
    // if not valid return error
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    // get data
    const permissions = (0, express_validator_1.matchedData)(req).permissions;
    // map role id to permission
    const rolePermission = permissions.map((permission) => {
        return {
            roleId: id,
            permissionId: permission,
        };
    });
    const role = await (0, role_services_1.findRoleById)(id);
    if (!role)
        return res.status(400).json({ message: "Role not found" });
    // unassign permission
    try {
        const roles = await (0, role_services_1.deleteRolePermission)(rolePermission);
        res.json({ message: "Permission successfully unassigned" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=role.routes.js.map