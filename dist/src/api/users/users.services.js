"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.deleteUser = exports.updateUser = exports.changeUserRole = exports.viewUserDetails = exports.viewAllUsers = exports.createUserByEmailAndPassword = exports.findUserById = exports.findUserByEmail = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../utils/db");
// View all users
async function viewAllUsers(query) {
    const paginate = +query.show || 10;
    const skipData = (+query.page - 1) * paginate || 0;
    const data = await db_1.db.user.findMany({
        take: paginate,
        skip: skipData,
        where: {
            role: {
                name: {
                    contains: query.role || "",
                    mode: "insensitive",
                },
            },
            profile: {
                name: {
                    contains: query.name || "",
                    mode: "insensitive",
                },
                // religion: null || query.religion,
                // gender: null || query.gender,
            },
        },
        select: {
            id: true,
            role: {
                select: {
                    name: true,
                },
            },
            email: true,
            profile: {
                select: {
                    name: true,
                    photo: true,
                },
            },
            createdAt: true,
            updatedAt: true,
        },
    });
    const count = await db_1.db.user.count({
        where: {
            role: {
                name: {
                    contains: query.role || "",
                    mode: "insensitive",
                },
            },
            profile: {
                name: {
                    contains: query.name || "",
                    mode: "insensitive",
                },
                // religion: null || query.religion,
                // gender: null || query.gender,
            },
        },
    });
    return {
        data,
        totalPage: Math.ceil(count / paginate).toString(),
        page: query.page || "1",
    };
}
exports.viewAllUsers = viewAllUsers;
// View Users Details
function viewUserDetails(id) {
    return db_1.db.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            roleID: true,
            email: true,
            profile: {
                select: {
                    name: true,
                    birthDate: true,
                    address: true,
                    gender: true,
                    religion: true,
                    photo: true,
                },
            },
            createdAt: true,
            updatedAt: true,
        },
    });
}
exports.viewUserDetails = viewUserDetails;
function createUser(user) {
    user.password = bcrypt_1.default.hashSync(user.password, 12);
    return db_1.db.user.create({
        data: {
            email: user.email,
            password: user.password,
            roleID: user.roleID,
            profile: {
                create: {
                    name: user.name,
                    birthDate: user.birthDate,
                    address: user.address,
                    gender: user.gender,
                    religion: user.religion,
                    photo: user.photo,
                },
            },
        },
    });
}
exports.createUser = createUser;
function createUserByEmailAndPassword(user) {
    user.password = bcrypt_1.default.hashSync(user.password, 12);
    return db_1.db.user.create({
        data: {
            email: user.email,
            password: user.password,
            roleID: user.roleID,
            profile: {
                create: {
                    name: user.name,
                },
            },
        },
    });
}
exports.createUserByEmailAndPassword = createUserByEmailAndPassword;
function findUserByEmail(email) {
    return db_1.db.user.findUnique({
        where: {
            email,
        },
    });
}
exports.findUserByEmail = findUserByEmail;
function findUserById(id) {
    return db_1.db.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            email: true,
            roleID: true,
            createdAt: true,
        },
    });
}
exports.findUserById = findUserById;
function changeUserRole(id, roleID) {
    return db_1.db.user.update({
        where: {
            id,
        },
        data: {
            roleID,
        },
    });
}
exports.changeUserRole = changeUserRole;
function updateUser(id, data) {
    return db_1.db.user.update({
        where: {
            id,
        },
        data: {
            email: data.email,
            password: data.password,
            profile: {
                update: {
                    name: data.name,
                    birthDate: data.birthDate,
                    address: data.address,
                    gender: data.gender,
                    religion: data.religion,
                    photo: data.photo,
                },
            },
        },
        select: {
            id: true,
            email: true,
            profile: {
                select: {
                    name: true,
                    birthDate: true,
                    address: true,
                    gender: true,
                    religion: true,
                    photo: true,
                },
            },
        },
    });
}
exports.updateUser = updateUser;
function deleteUser(id) {
    return db_1.db.user.delete({
        where: {
            id,
        },
    });
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=users.services.js.map