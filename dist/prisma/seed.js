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
var client_1 = require("@prisma/client");
var bcrypt_1 = __importDefault(require("bcrypt"));
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var create, read, update, delete_, superadmin, admin, teacher, student, parent, adminPermission, teacherPermission, studentPermission, parentPermission, superadminUser, adminUser, teacherUser, studentUser, class1, spp, parent1, subject1, scoreCategory1, score1, qris, generateReferenceNumber, transaction1, transactionDetail1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.permission.create({
                        data: {
                            name: "Create User",
                            action: "POST",
                            menu: "user",
                        },
                    })];
                case 1:
                    create = _a.sent();
                    return [4 /*yield*/, prisma.permission.create({
                            data: {
                                name: "View User",
                                action: "GET",
                                menu: "user",
                            },
                        })];
                case 2:
                    read = _a.sent();
                    return [4 /*yield*/, prisma.permission.create({
                            data: {
                                name: "Update User",
                                action: "PUT",
                                menu: "user",
                            },
                        })];
                case 3:
                    update = _a.sent();
                    return [4 /*yield*/, prisma.permission.create({
                            data: {
                                name: "Delete User",
                                action: "DELETE",
                                menu: "user",
                            },
                        })];
                case 4:
                    delete_ = _a.sent();
                    return [4 /*yield*/, prisma.role.create({
                            data: {
                                name: "superadmin",
                            },
                        })];
                case 5:
                    superadmin = _a.sent();
                    return [4 /*yield*/, prisma.role.create({
                            data: {
                                name: "admin",
                            },
                        })];
                case 6:
                    admin = _a.sent();
                    return [4 /*yield*/, prisma.role.create({
                            data: {
                                name: "teacher",
                            },
                        })];
                case 7:
                    teacher = _a.sent();
                    return [4 /*yield*/, prisma.role.create({
                            data: {
                                name: "student",
                            },
                        })];
                case 8:
                    student = _a.sent();
                    return [4 /*yield*/, prisma.role.create({
                            data: {
                                name: "parent",
                            },
                        })];
                case 9:
                    parent = _a.sent();
                    return [4 /*yield*/, prisma.rolePermission.createMany({
                            data: [
                                {
                                    roleId: admin.id,
                                    permissionId: create.id,
                                },
                                {
                                    roleId: admin.id,
                                    permissionId: read.id,
                                },
                                {
                                    roleId: admin.id,
                                    permissionId: update.id,
                                },
                                {
                                    roleId: admin.id,
                                    permissionId: delete_.id,
                                },
                            ],
                        })];
                case 10:
                    adminPermission = _a.sent();
                    return [4 /*yield*/, prisma.rolePermission.createMany({
                            data: [
                                {
                                    roleId: teacher.id,
                                    permissionId: read.id,
                                },
                            ],
                        })];
                case 11:
                    teacherPermission = _a.sent();
                    return [4 /*yield*/, prisma.rolePermission.createMany({
                            data: [
                                {
                                    roleId: student.id,
                                    permissionId: read.id,
                                },
                            ],
                        })];
                case 12:
                    studentPermission = _a.sent();
                    return [4 /*yield*/, prisma.rolePermission.createMany({
                            data: [
                                {
                                    roleId: parent.id,
                                    permissionId: read.id,
                                },
                            ],
                        })];
                case 13:
                    parentPermission = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: "super@admin.com",
                                password: bcrypt_1.default.hashSync("P@ssw0rd", 12),
                                roleID: superadmin.id,
                                profile: {
                                    create: {
                                        name: "Super Admin",
                                    },
                                },
                            },
                        })];
                case 14:
                    superadminUser = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: "admin@admin.com",
                                password: bcrypt_1.default.hashSync("P@ssw0rd", 12),
                                roleID: admin.id,
                                profile: {
                                    create: {
                                        name: "Admin",
                                    },
                                },
                            },
                        })];
                case 15:
                    adminUser = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: "bayu@gmail.com",
                                password: bcrypt_1.default.hashSync("P@ssw0rd", 12),
                                roleID: teacher.id,
                                profile: {
                                    create: {
                                        name: "Aji Bayu Nugroho",
                                    },
                                },
                            },
                        })];
                case 16:
                    teacherUser = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: "tama@gmail.com",
                                password: bcrypt_1.default.hashSync("P@ssw0rd", 12),
                                roleID: student.id,
                                profile: {
                                    create: {
                                        name: "Pertamawati",
                                    },
                                },
                            },
                        })];
                case 17:
                    studentUser = _a.sent();
                    return [4 /*yield*/, prisma.class.create({
                            data: {
                                name: "XII RPL 1",
                                teacherId: teacherUser.id,
                            },
                        })];
                case 18:
                    class1 = _a.sent();
                    return [4 /*yield*/, prisma.payment.create({
                            data: {
                                name: "SPP",
                                type: "semester",
                                amount: 1000000,
                            },
                        })];
                case 19:
                    spp = _a.sent();
                    return [4 /*yield*/, prisma.parent.create({
                            data: {
                                name: "Tono",
                                address: "Jl. Sukaraja No. 1",
                                phone: "081234567890",
                                userId: studentUser.id,
                            },
                        })];
                case 20:
                    parent1 = _a.sent();
                    return [4 /*yield*/, prisma.subject.create({
                            data: {
                                name: "Bahasa Indonesia",
                            },
                        })];
                case 21:
                    subject1 = _a.sent();
                    return [4 /*yield*/, prisma.scoreCategory.create({
                            data: {
                                name: "Ulangan Harian",
                            },
                        })];
                case 22:
                    scoreCategory1 = _a.sent();
                    return [4 /*yield*/, prisma.score.create({
                            data: {
                                subjectId: subject1.id,
                                userId: studentUser.id,
                                score: 90,
                                categoryId: scoreCategory1.id,
                            },
                        })];
                case 23:
                    score1 = _a.sent();
                    return [4 /*yield*/, prisma.paymentMethod.create({
                            data: {
                                name: "qris",
                                image: "https://seeklogo.com/images/Q/quick-response-code-indonesia-standard-qris-logo-F300D5EB32-seeklogo.com.png",
                            },
                        })];
                case 24:
                    qris = _a.sent();
                    generateReferenceNumber = "INV-" +
                        Math.floor(100000 + Math.random() * 900000) +
                        "-" +
                        new Date().toISOString().slice(11, 16).replace(":", "");
                    return [4 /*yield*/, prisma.transaction.create({
                            data: {
                                referenceNumber: generateReferenceNumber,
                                userId: studentUser.id,
                                paymentMethodId: qris.id,
                            },
                        })];
                case 25:
                    transaction1 = _a.sent();
                    return [4 /*yield*/, prisma.transactionDetail.create({
                            data: {
                                transactionId: transaction1.id,
                                paymentId: spp.id,
                            },
                        })];
                case 26:
                    transactionDetail1 = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error(e);
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=seed.js.map