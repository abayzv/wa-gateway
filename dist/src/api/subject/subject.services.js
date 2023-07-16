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
exports.findSubjectByManyId = exports.updateSubject = exports.deleteSubject = exports.findSubjectByName = exports.createSubject = exports.getSubjectById = exports.findSubjectById = exports.getAllSubject = void 0;
var db_1 = require("../../utils/db");
// get all subject
var getAllSubject = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var paginate, skipData, data, count, teacherList, dataSubjects;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paginate = +query.show || 10;
                skipData = (+query.page - 1) * paginate || 0;
                return [4 /*yield*/, db_1.db.subject.findMany({
                        take: paginate,
                        skip: skipData,
                        where: {
                            name: {
                                contains: query.name || "",
                                mode: "insensitive",
                            },
                        },
                        select: {
                            id: true,
                            name: true,
                            user: {
                                select: {
                                    profile: {
                                        select: {
                                            name: true,
                                            photo: true,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, db_1.db.subject.count({
                        where: {
                            name: {
                                contains: query.name || "",
                                mode: "insensitive",
                            },
                        },
                    })];
            case 2:
                count = _a.sent();
                teacherList = function (teachers) {
                    return teachers.map(function (teacher) {
                        return {
                            name: teacher.profile.name,
                            photo: teacher.profile.photo,
                        };
                    });
                };
                dataSubjects = data.map(function (subject) {
                    return {
                        id: subject.id,
                        name: subject.name,
                        teacher: teacherList(subject.user),
                    };
                });
                return [2 /*return*/, {
                        data: dataSubjects,
                        totalPage: Math.ceil(count / paginate).toString(),
                        page: query.page || "1",
                    }];
        }
    });
}); };
exports.getAllSubject = getAllSubject;
// find subject by id
var findSubjectById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.subject.findUnique({
                    where: {
                        id: id,
                    },
                })];
            case 1:
                data = _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.findSubjectById = findSubjectById;
var findSubjectByName = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.subject.findFirst({
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
exports.findSubjectByName = findSubjectByName;
// get subject by id
var getSubjectById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.subject.findUnique({
                    where: {
                        id: id,
                    },
                    select: {
                        id: true,
                        name: true,
                        user: {
                            select: {
                                id: true,
                                profile: {
                                    select: {
                                        name: true,
                                        photo: true,
                                    },
                                },
                            },
                        },
                        score: {
                            select: {
                                score: true,
                                user: {
                                    select: {
                                        id: true,
                                        profile: {
                                            select: {
                                                name: true,
                                                photo: true,
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
exports.getSubjectById = getSubjectById;
// create subject
var createSubject = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var subject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.subject.create({
                    data: {
                        name: data.name,
                    },
                })];
            case 1:
                subject = _a.sent();
                return [2 /*return*/, subject];
        }
    });
}); };
exports.createSubject = createSubject;
// update subject
var updateSubject = function (id, data) { return __awaiter(void 0, void 0, void 0, function () {
    var subject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.subject.update({
                    where: {
                        id: id,
                    },
                    data: {
                        name: data.name,
                    },
                })];
            case 1:
                subject = _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.updateSubject = updateSubject;
// delete subject
var deleteSubject = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var subject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.subject.delete({
                    where: {
                        id: id,
                    },
                })];
            case 1:
                subject = _a.sent();
                return [2 /*return*/, subject];
        }
    });
}); };
exports.deleteSubject = deleteSubject;
var findSubjectByManyId = function (ids) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.subject.findMany({
                    where: {
                        id: {
                            in: ids,
                        },
                    },
                })];
            case 1:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
exports.findSubjectByManyId = findSubjectByManyId;
//# sourceMappingURL=subject.services.js.map