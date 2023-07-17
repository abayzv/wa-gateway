"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../../middlewares");
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_services_1 = require("./users.services");
const role_services_1 = require("../role/role.services");
const router = express_1.default.Router();
const changeUserRoleRules = {
    roleID: {
        notEmpty: {
            errorMessage: "Role is required",
        },
    },
};
const updateUserRules = {
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
            options: (value, { req }) => {
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
const createUserRules = {
    email: {
        isEmail: {
            errorMessage: "Invalid email",
        },
        custom: {
            options: async (value) => {
                if (!value)
                    return Promise.reject("Email is required");
                const user = await (0, users_services_1.findUserByEmail)(value);
                if (user) {
                    return Promise.reject("Email already in use");
                }
            },
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
            options: (value, { req }) => {
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
            options: async (value) => {
                // must be integer and must be one of the roles
                if (!value)
                    return Promise.reject("Role ID is required");
                if (!Number.isInteger(value)) {
                    return Promise.reject("Role ID must be an integer");
                }
                // check if role exists
                const role = await (0, role_services_1.findRoleById)(value);
                if (!role) {
                    return Promise.reject("Role ID does not exist");
                }
            },
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
router.get("/", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    const query = {
        name: req.query.name,
        role: req.query.role,
        page: req.query.page,
        show: req.query.show,
    };
    try {
        const users = await (0, users_services_1.viewAllUsers)(query);
        res.json(users);
    }
    catch (error) {
        next(error);
    }
});
router.get("/me", middlewares_1.isAuthenticated, async (req, res, next) => {
    try {
        const { userId } = req.payload;
        const user = await (0, users_services_1.findUserById)(userId);
        res.json(user);
    }
    catch (err) {
        next(err);
    }
});
router.get("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, async (req, res, next) => {
    var _a;
    try {
        const id = req.params.id;
        const user = await (0, users_services_1.viewUserDetails)(id);
        if (!user)
            return res.status(400).json({ message: "User not found" });
        const userResponse = {};
        const userTransaction = [];
        const mapCategoryScore = (data) => {
            // group data by item.category.name in data
            const groupByCategory = data.reduce((acc, item) => {
                const key = item.category.name;
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
                userResponse["createdAt"] = user.createdAt;
                userResponse["updatedAt"] = user.updatedAt;
                break;
            case 4:
                userResponse["email"] = user.email;
                userResponse["role"] = UserRoles[user.roleID];
                userResponse["profile"] = user.profile;
                userResponse["createdAt"] = user.createdAt;
                userResponse["updatedAt"] = user.updatedAt;
        }
        res.json({ data: userResponse });
    }
    catch (error) {
        next(error);
    }
});
router.post("/", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Create User", "Successfully create a new user"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(createUserRules), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const data = (0, express_validator_1.matchedData)(req);
    const userData = {
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
    try {
        const user = await (0, users_services_1.createUser)(userData);
        res.json({ message: "User Created Succesfully", data: user });
    }
    catch (error) {
        next(error);
    }
});
router.put("/role/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Change User Role", "Successfully change user role"), middlewares_1.isPermited, (0, express_validator_1.checkSchema)(changeUserRoleRules), async (req, res, next) => {
    try {
        const id = req.params.id;
        const { roleID } = (0, express_validator_1.matchedData)(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const user = await (0, users_services_1.findUserById)(id);
        if (!user)
            return res.status(400).json({ message: "User not found" });
        // change user role
        const role = await (0, users_services_1.changeUserRole)(id, roleID);
        res.json({ message: "Role Changed Succesfully" });
    }
    catch (error) {
        next(error);
    }
});
router.put("/:id", middlewares_1.isAuthenticated, middlewares_1.isPermited, (0, express_validator_1.checkSchema)(updateUserRules), async (req, res, next) => {
    const id = req.params.id;
    const errors = (0, express_validator_1.validationResult)(req);
    if (Object.keys(req.body).length === 0)
        return res.status(411).json({ message: "No data to update" });
    const user = await (0, users_services_1.findUserById)(id);
    if (!user)
        return res.status(400).json({ message: "User not found" });
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const data = (0, express_validator_1.matchedData)(req);
    if (data.email) {
        const emailExist = await (0, users_services_1.findUserByEmail)(data.email);
        if (emailExist && emailExist.id !== id)
            return res.status(400).json({ message: "Email already exist" });
    }
    if (data.birthDate) {
        const birthDate = new Date(data.birthDate);
        if (birthDate.toString() === "Invalid Date")
            return res.status(400).json({ message: "Invalid Date" });
        data.birthDate = birthDate;
    }
    if (data.password) {
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(data.password, salt);
        data.password = hashedPassword;
    }
    try {
        const user = await (0, users_services_1.updateUser)(id, data);
        res.json({ message: "User Updated Succesfully", data: user });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:id", middlewares_1.isAuthenticated, (0, middlewares_1.activityLogger)("Delete User", "Successfully delete a use"), middlewares_1.isPermited, async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await (0, users_services_1.findUserById)(id);
        if (!user)
            return res.status(400).json({ message: "User not found" });
        const userDeleted = await (0, users_services_1.deleteUser)(id);
        res.json({ message: "User Deleted Succesfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=users.routes.js.map