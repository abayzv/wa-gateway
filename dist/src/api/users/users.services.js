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
exports.createUser = exports.deleteUser = exports.updateUser = exports.changeUserRole = exports.viewUserDetails = exports.viewAllUsers = exports.createUserByEmailAndPassword = exports.findUserById = exports.findUserByEmail = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var db_1 = require("../../utils/db");
// View all users
function viewAllUsers(query) {
    return __awaiter(this, void 0, void 0, function () {
        var paginate, skipData, data, count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paginate = +query.show || 10;
                    skipData = (+query.page - 1) * paginate || 0;
                    return [4 /*yield*/, db_1.db.user.findMany({
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
                        })];
                case 1:
                    data = _a.sent();
                    return [4 /*yield*/, db_1.db.user.count({
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
                        })];
                case 2:
                    count = _a.sent();
                    return [2 /*return*/, {
                            data: data,
                            totalPage: Math.ceil(count / paginate).toString(),
                            page: query.page || "1",
                        }];
            }
        });
    });
}
exports.viewAllUsers = viewAllUsers;
// View Users Details
function viewUserDetails(id) {
    return db_1.db.user.findUnique({
        where: {
            id: id,
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
            class: {
                select: {
                    id: true,
                    name: true,
                },
            },
            score: {
                select: {
                    id: true,
                    score: true,
                    subject: {
                        select: {
                            name: true,
                        },
                    },
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
            teacherClass: {
                select: {
                    id: true,
                    name: true,
                },
            },
            transaction: {
                select: {
                    id: true,
                    items: {
                        select: {
                            payment: {
                                select: {
                                    name: true,
                                    type: true,
                                    amount: true,
                                },
                            },
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            },
            parent: {
                select: {
                    name: true,
                    phone: true,
                    address: true,
                },
            },
            subject: {
                select: {
                    name: true,
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
            email: email,
        },
    });
}
exports.findUserByEmail = findUserByEmail;
function findUserById(id) {
    return db_1.db.user.findUnique({
        where: {
            id: id,
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
            id: id,
        },
        data: {
            roleID: roleID,
        },
    });
}
exports.changeUserRole = changeUserRole;
function updateUser(id, data) {
    return db_1.db.user.update({
        where: {
            id: id,
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
            id: id,
        },
    });
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=users.services.js.map