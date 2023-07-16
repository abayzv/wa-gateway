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
var bcrypt_1 = __importDefault(require("bcrypt"));
var users_services_1 = require("./users.services");
var role_services_1 = require("../role/role.services");
var router = express_1.default.Router();
var changeUserRoleRules = {
    roleID: {
        notEmpty: {
            errorMessage: "Role is required",
        },
    },
};
var updateUserRules = {
    email: {
        optional: true,
        isEmail: {
            errorMessage: "Invalid email",
        },
    },
    password: {
        optional: true,
        isLength: {
            options: { min: 6 },
            errorMessage: "Password must be at least 6 characters long",
        },
    },
    confirmPassword: {
        custom: {
            options: function (value, _a) {
                var req = _a.req;
                if (req.body.password && !value) {
                    throw new Error("Password confirmation is required");
                }
                else if (value !== req.body.password) {
                    throw new Error("Password confirmation does not match password");
                }
                return true;
            },
        },
    },
    name: {
        optional: true,
        isLength: {
            options: { min: 3 },
            errorMessage: "Name must be at least 3 characters long",
        },
    },
    phone: {
        optional: true,
        isLength: {
            options: { min: 11 },
            errorMessage: "Phone must be at least 11 characters long",
        },
    },
    address: {
        optional: true,
        isLength: {
            options: { min: 3 },
            errorMessage: "Address must be at least 3 characters long",
        },
    },
    religion: {
        optional: true,
        isLength: {
            options: { min: 3 },
            errorMessage: "Religion must be at least 3 characters long",
        },
    },
    gender: {
        optional: true,
        isLength: {
            options: { min: 3 },
            errorMessage: "Gender must be at least 3 characters long",
        },
    },
    birthDate: {
        optional: true,
        isLength: {
            options: { min: 3 },
            errorMessage: "Birth Date must be at least 3 characters long",
        },
    },
    photo: {
        optional: true,
        isLength: {
            options: { min: 3 },
            errorMessage: "Photo must be at least 3 characters long",
        },
    },
};
var createUserRules = {
    email: {
        isEmail: {
            errorMessage: "Invalid email",
        },
        custom: {
            options: function (value) { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!value)
                                return [2 /*return*/, Promise.reject("Email is required")];
                            return [4 /*yield*/, (0, users_services_1.findUserByEmail)(value)];
                        case 1:
                            user = _a.sent();
                            if (user) {
                                return [2 /*return*/, Promise.reject("Email already in use")];
                            }
                            return [2 /*return*/];
                    }
                });
            }); },
        },
    },
    password: {
        isLength: {
            options: { min: 6 },
            errorMessage: "Password must be at least 6 characters long",
        },
    },
    confirmPassword: {
        custom: {
            options: function (value, _a) {
                var req = _a.req;
                if (value !== req.body.password) {
                    throw new Error("Password confirmation does not match password");
                }
                return true;
            },
        },
    },
    name: {
        isLength: {
            options: { min: 3 },
            errorMessage: "Name must be at least 3 characters long",
        },
    },
    birthDate: {
        isLength: {
            options: { min: 3 },
            errorMessage: "Birth Date must be at least 3 characters long",
        },
        isDate: {
            errorMessage: "Birth Date must be a date",
        },
    },
    address: {
        isLength: {
            options: { min: 3 },
            errorMessage: "Address must be at least 3 characters long",
        },
    },
    gender: {
        isLength: {
            options: { min: 3 },
            errorMessage: "Gender must be at least 3 characters long",
        },
    },
    religion: {
        isLength: {
            options: { min: 3 },
            errorMessage: "Religion must be at least 3 characters long",
        },
    },
    photo: {
        optional: true,
        isLength: {
            options: { min: 3 },
            errorMessage: "Photo must be at least 3 characters long",
        },
    },
    roleId: {
        notEmpty: {
            errorMessage: "Role ID is required",
        },
        custom: {
            options: function (value) { return __awaiter(void 0, void 0, void 0, function () {
                var role;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // must be integer and must be one of the roles
                            if (!value)
                                return [2 /*return*/, Promise.reject("Role ID is required")];
                            if (!Number.isInteger(value)) {
                                return [2 /*return*/, Promise.reject("Role ID must be an integer")];
                            }
                            return [4 /*yield*/, (0, role_services_1.findRoleById)(value)];
                        case 1:
                            role = _a.sent();
                            if (!role) {
                                return [2 /*return*/, Promise.reject("Role ID does not exist")];
                            }
                            return [2 /*return*/];
                    }
                });
            }); },
        },
    },
};
var UserRoles;
(function (UserRoles) {
    UserRoles[UserRoles["superadmin"] = 1] = "superadmin";
    UserRoles[UserRoles["admin"] = 2] = "admin";
    UserRoles[UserRoles["teacher"] = 3] = "teacher";
    UserRoles[UserRoles["student"] = 4] = "student";
    UserRoles[UserRoles["parent"] = 5] = "parent";
})(UserRoles || (UserRoles = {}));
router.get("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var query, users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = {
                    name: req.query.name,
                    role: req.query.role,
                    page: req.query.page,
                    show: req.query.show,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, users_services_1.viewAllUsers)(query)];
            case 2:
                users = _a.sent();
                res.json(users);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/me", middlewares_1.isAuthenticated, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.payload.userId;
                return [4 /*yield*/, (0, users_services_1.findUserById)(userId)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, userResponse, userTransaction_1, mapCategoryScore, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, users_services_1.viewUserDetails)(id)];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.status(400).json({ message: "User not found" })];
                userResponse = {};
                userTransaction_1 = [];
                // get user transaction
                user.transaction.forEach(function (transaction) {
                    var amount = 0;
                    transaction.items.forEach(function (item) {
                        amount += item.payment.amount;
                    });
                    userTransaction_1.push({
                        id: transaction.id,
                        ammount: amount,
                        payment: transaction.payment,
                        items: transaction.items,
                        createdAt: transaction.createdAt,
                        updatedAt: transaction.updatedAt,
                    });
                });
                mapCategoryScore = function (data) {
                    // group data by item.category.name in data
                    var groupByCategory = data.reduce(function (acc, item) {
                        var key = item.category.name;
                        if (!acc[key]) {
                            acc[key] = [];
                        }
                        acc[key].push({
                            id: item.id,
                            score: item.score,
                            subject: item.subject.name,
                        });
                        return acc;
                    }, {});
                    return groupByCategory;
                };
                switch (user.roleID) {
                    case 1:
                        userResponse["email"] = user.email;
                        userResponse["role"] = UserRoles[user.roleID];
                        userResponse["profile"] = {
                            name: (_a = user.profile) === null || _a === void 0 ? void 0 : _a.name,
                        };
                        userResponse["createdAt"] = user.createdAt;
                        userResponse["updatedAt"] = user.updatedAt;
                        break;
                    case 2:
                        userResponse["email"] = user.email;
                        userResponse["role"] = UserRoles[user.roleID];
                        userResponse["profile"] = user.profile;
                        userResponse["createdAt"] = user.createdAt;
                        userResponse["updatedAt"] = user.updatedAt;
                        break;
                    case 3:
                        userResponse["email"] = user.email;
                        userResponse["role"] = UserRoles[user.roleID];
                        userResponse["profile"] = user.profile;
                        userResponse["class"] = user.teacherClass;
                        userResponse["subject"] = user.subject;
                        userResponse["createdAt"] = user.createdAt;
                        userResponse["updatedAt"] = user.updatedAt;
                        break;
                    case 4:
                        userResponse["email"] = user.email;
                        userResponse["role"] = UserRoles[user.roleID];
                        userResponse["profile"] = user.profile;
                        userResponse["parent"] = user.parent;
                        userResponse["class"] = user.class;
                        userResponse["score"] = mapCategoryScore(user.score);
                        userResponse["transaction"] = userTransaction_1;
                        userResponse["createdAt"] = user.createdAt;
                        userResponse["updatedAt"] = user.updatedAt;
                }
                res.json({ data: userResponse });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Create User", "Successfully create a new user"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(createUserRules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, data, userData, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                data = (0, express_validator_1.matchedData)(req);
                userData = {
                    email: data.email,
                    password: data.password,
                    roleID: data.roleId,
                    name: data.name,
                    address: data.address,
                    birthDate: new Date(data.birthDate),
                    gender: data.gender,
                    religion: data.religion,
                    photo: data.photo,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, users_services_1.createUser)(userData)];
            case 2:
                user = _a.sent();
                res.json({ message: "User Created Succesfully", data: user });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put("/role/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Change User Role", "Successfully change user role"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(changeUserRoleRules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, roleID, errors, user, role, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                roleID = (0, express_validator_1.matchedData)(req).roleID;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                return [4 /*yield*/, (0, users_services_1.findUserById)(id)];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(400).json({ message: "User not found" })];
                return [4 /*yield*/, (0, users_services_1.changeUserRole)(id, roleID)];
            case 2:
                role = _a.sent();
                res.json({ message: "Role Changed Succesfully" });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, express_validator_1.checkSchema)(updateUserRules), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, errors, user, data, emailExist, birthDate, salt, hashedPassword, user_1, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (Object.keys(req.body).length === 0)
                    return [2 /*return*/, res.status(411).json({ message: "No data to update" })];
                return [4 /*yield*/, (0, users_services_1.findUserById)(id)];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(400).json({ message: "User not found" })];
                if (!errors.isEmpty())
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                data = (0, express_validator_1.matchedData)(req);
                if (!data.email) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, users_services_1.findUserByEmail)(data.email)];
            case 2:
                emailExist = _a.sent();
                if (emailExist && emailExist.id !== id)
                    return [2 /*return*/, res.status(400).json({ message: "Email already exist" })];
                _a.label = 3;
            case 3:
                if (data.birthDate) {
                    birthDate = new Date(data.birthDate);
                    if (birthDate.toString() === "Invalid Date")
                        return [2 /*return*/, res.status(400).json({ message: "Invalid Date" })];
                    data.birthDate = birthDate;
                }
                if (!data.password) return [3 /*break*/, 6];
                return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
            case 4:
                salt = _a.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(data.password, salt)];
            case 5:
                hashedPassword = _a.sent();
                data.password = hashedPassword;
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, (0, users_services_1.updateUser)(id, data)];
            case 7:
                user_1 = _a.sent();
                res.json({ message: "User Updated Succesfully", data: user_1 });
                return [3 /*break*/, 9];
            case 8:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.delete("/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Delete User", "Successfully delete a use"), middlewares_1.isPermited, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, userDeleted, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, (0, users_services_1.findUserById)(id)];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(400).json({ message: "User not found" })];
                return [4 /*yield*/, (0, users_services_1.deleteUser)(id)];
            case 2:
                userDeleted = _a.sent();
                res.json({ message: "User Deleted Succesfully" });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=users.routes.js.map