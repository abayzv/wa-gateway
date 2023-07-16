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
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignStudent = exports.deleteClassroom = exports.findClassRoomByName = exports.findTeacherById = exports.updateClassroom = exports.isHaveClassRoom = exports.createClassroom = exports.getClassroomsById = exports.getAllClassroom = void 0;
var db_1 = require("../../utils/db");
// get all classroom
var getAllClassroom = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var paginate, skipData, data, count, dataClassrooms;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paginate = +query.show || 10;
                skipData = (+query.page - 1) * paginate || 0;
                return [4 /*yield*/, db_1.db.class.findMany({
                        skip: skipData,
                        take: paginate,
                        where: {
                            name: {
                                contains: query.name || "",
                                mode: "insensitive",
                            },
                        },
                        include: {
                            teacher: {
                                select: {
                                    profile: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                            _count: {
                                select: {
                                    student: true,
                                },
                            },
                        },
                    })];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, db_1.db.class.count({
                        where: {
                            name: {
                                contains: query.name || "",
                                mode: "insensitive",
                            },
                        },
                    })];
            case 2:
                count = _a.sent();
                dataClassrooms = data.map(function (classroom) {
                    var _a, _b, _c;
                    return {
                        id: classroom.id,
                        name: classroom.name,
                        teacerId: classroom.teacherId,
                        teacherName: (_b = (_a = classroom.teacher) === null || _a === void 0 ? void 0 : _a.profile) === null || _b === void 0 ? void 0 : _b.name,
                        student: (_c = classroom._count) === null || _c === void 0 ? void 0 : _c.student,
                    };
                });
                return [2 /*return*/, {
                        data: dataClassrooms,
                        totalPage: Math.ceil(count / paginate).toString(),
                        page: query.page || "1",
                    }];
        }
    });
}); };
exports.getAllClassroom = getAllClassroom;
// get classrooms details
var getClassroomsById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.class.findUnique({
                    where: {
                        id: id,
                    },
                    select: {
                        id: true,
                        name: true,
                        teacherId: true,
                        teacher: {
                            select: {
                                profile: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        student: {
                            select: {
                                id: true,
                                profile: {
                                    select: {
                                        name: true,
                                        photo: true,
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
                            },
                        },
                    },
                })];
            case 1:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
exports.getClassroomsById = getClassroomsById;
// create class room
var createClassroom = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var classroom;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.class.create({
                    data: {
                        name: data.name,
                        teacherId: data.teacherId,
                    },
                })];
            case 1:
                classroom = _a.sent();
                return [2 /*return*/, classroom];
        }
    });
}); };
exports.createClassroom = createClassroom;
var isHaveClassRoom = function (teacherId) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.class.findFirst({
                    where: {
                        teacherId: teacherId,
                    },
                })];
            case 1:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
exports.isHaveClassRoom = isHaveClassRoom;
var updateClassroom = function (id, data) { return __awaiter(void 0, void 0, void 0, function () {
    var classroom;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.class.update({
                    where: {
                        id: id,
                    },
                    data: {
                        name: data.name,
                        teacherId: data.teacherId,
                    },
                })];
            case 1:
                classroom = _a.sent();
                return [2 /*return*/, classroom];
        }
    });
}); };
exports.updateClassroom = updateClassroom;
var findTeacherById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.user.findFirst({
                    where: {
                        id: id,
                        role: {
                            name: "teacher",
                        },
                    },
                })];
            case 1:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
exports.findTeacherById = findTeacherById;
var findClassRoomByName = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.class.findFirst({
                    where: {
                        name: name,
                    },
                })];
            case 1:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
exports.findClassRoomByName = findClassRoomByName;
var deleteClassroom = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var classroom;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.class.delete({
                    where: {
                        id: id,
                    },
                })];
            case 1:
                classroom = _a.sent();
                return [2 /*return*/, classroom];
        }
    });
}); };
exports.deleteClassroom = deleteClassroom;
var assignStudent = function (id, data) { return __awaiter(void 0, void 0, void 0, function () {
    var classroom;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.class.update({
                    where: {
                        id: id,
                    },
                    data: {
                        student: {
                            connect: data.map(function (studentId) {
                                return {
                                    id: studentId,
                                };
                            }),
                        },
                    },
                })];
            case 1:
                classroom = _a.sent();
                return [2 /*return*/, classroom];
        }
    });
}); };
exports.assignStudent = assignStudent;
//# sourceMappingURL=classroom.services.js.map