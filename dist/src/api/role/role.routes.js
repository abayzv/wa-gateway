"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var middlewares_1 = require("../../middlewares");
var role_services_1 = require("./role.services");
var router = express_1.default.Router();
// Validation Rules
var rules = {
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
var rolePermissionRules = {
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
router.get("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var query, roles, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = {
                    name: req.query.name,
                    page: req.query.page,
                    show: req.query.show,
                };
                return [4 /*yield*/, (0, role_services_1.viewAllRoles)(query)];
            case 1:
                roles = _a.sent();
                res.json(roles);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// View Role Detail
router.get("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, role, roles, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = +req.params.id;
                return [4 /*yield*/, (0, role_services_1.findRoleById)(id)];
            case 1:
                role = _a.sent();
                if (!role)
                    return [2 /*return*/, res.status(400).json({ message: "Role not found" })];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, role_services_1.findRoleById)(id)];
            case 3:
                roles = _a.sent();
                res.json({ data: roles });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Create Role
router.post("/", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Create Role", "Successfully create role"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, name, roleData, isExist, roles, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                // if not valid return error
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                name = (0, express_validator_1.matchedData)(req).name;
                roleData = {
                    name: name,
                };
                return [4 /*yield*/, (0, role_services_1.findRoleByName)(name)];
            case 1:
                isExist = _a.sent();
                if (isExist)
                    return [2 /*return*/, res.status(400).json({ message: "Role already exist" })];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, role_services_1.createRole)(roleData)];
            case 3:
                roles = _a.sent();
                res.json({ message: "Role successfully created", data: roles });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Update Role
router.put("/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Update Role", "Successfully update role"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, id, name, roleData, isExist, roles, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                id = +req.params.id;
                // if not valid return error
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                name = (0, express_validator_1.matchedData)(req).name;
                roleData = {
                    id: id,
                    name: name,
                };
                return [4 /*yield*/, (0, role_services_1.findRoleByName)(name)];
            case 1:
                isExist = _a.sent();
                if (isExist)
                    return [2 /*return*/, res.status(400).json({ message: "Role already exist" })];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, role_services_1.updateRole)(roleData)];
            case 3:
                roles = _a.sent();
                res.json({ message: "Role successfully updated", data: roles });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Delete Role
router.delete("/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Delete Role", "Successfully delete role"), middlewares_1.isPermited, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, role, roles, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = +req.params.id;
                return [4 /*yield*/, (0, role_services_1.findRoleById)(id)];
            case 1:
                role = _a.sent();
                if (!role)
                    return [2 /*return*/, res.status(400).json({ message: "Role not found" })];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, role_services_1.deleteRole)(id)];
            case 3:
                roles = _a.sent();
                res.json({ message: "Role successfully deleted" });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Assign Role Permission
router.post("/assign/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Assign Role Permission", "Successfully assign permission"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rolePermissionRules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, errors, role, permissions, mappedPermission, isExist, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = +req.params.id;
                errors = (0, express_validator_1.validationResult)(req);
                // if not valid return error
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                return [4 /*yield*/, (0, role_services_1.findRoleById)(id)];
            case 1:
                role = _a.sent();
                if (!role)
                    return [2 /*return*/, res.status(400).json({ message: "Role not found" })];
                permissions = (0, express_validator_1.matchedData)(req).permissions;
                mappedPermission = permissions.map(function (permission) {
                    return {
                        roleId: id,
                        permissionId: permission,
                    };
                });
                return [4 /*yield*/, (0, role_services_1.isRolePermissionExist)(mappedPermission)];
            case 2:
                isExist = _a.sent();
                if (isExist)
                    return [2 /*return*/, res.status(400).json({
                            message: "Permission already assigned, please change to another permission",
                            data: isExist.map(function (item) {
                                return {
                                    name: item.permission.name,
                                };
                            }),
                        })];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, role_services_1.assignRolePermission)(mappedPermission)];
            case 4:
                _a.sent();
                res.json({ message: "Permission successfully assigned" });
                return [3 /*break*/, 6];
            case 5:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Unassign Role Permission
router.delete("/unassign/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Unassign Role Permission", "Successfully unassign permission"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(rolePermissionRules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, errors, permissions, rolePermission, role, roles, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = +req.params.id;
                errors = (0, express_validator_1.validationResult)(req);
                // if not valid return error
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                permissions = (0, express_validator_1.matchedData)(req).permissions;
                rolePermission = permissions.map(function (permission) {
                    return {
                        roleId: id,
                        permissionId: permission,
                    };
                });
                return [4 /*yield*/, (0, role_services_1.findRoleById)(id)];
            case 1:
                role = _a.sent();
                if (!role)
                    return [2 /*return*/, res.status(400).json({ message: "Role not found" })];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, role_services_1.deleteRolePermission)(rolePermission)];
            case 3:
                roles = _a.sent();
                res.json({ message: "Permission successfully unassigned" });
                return [3 /*break*/, 5];
            case 4:
                error_7 = _a.sent();
                next(error_7);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=role.routes.js.map