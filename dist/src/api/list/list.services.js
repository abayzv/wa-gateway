"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScoreCategoryList = exports.getSubjectList = exports.getRoleList = exports.getPermissionList = exports.getClassroomList = exports.getTeacherList = void 0;
const db_1 = require("../../utils/db");
const getTeacherList = async () => {
    const data = await db_1.db.user.findMany({
        where: {
            role: {
                name: "teacher",
            },
        },
        select: {
            id: true,
            profile: {
                select: {
                    name: true,
                },
            },
            teacherClass: true,
        },
    });
    const teacher = data.map((teacher) => {
        var _a;
        return {
            id: teacher.id,
            name: (_a = teacher.profile) === null || _a === void 0 ? void 0 : _a.name,
            haveClass: teacher.teacherClass ? true : false,
        };
    });
    return teacher;
};
exports.getTeacherList = getTeacherList;
const getClassroomList = async () => {
    const data = await db_1.db.class.findMany({
        select: {
            id: true,
            name: true,
        },
    });
    return data;
};
exports.getClassroomList = getClassroomList;
const getPermissionList = async () => {
    const data = await db_1.db.permission.findMany({
        select: {
            id: true,
            name: true,
        },
    });
    return data;
};
exports.getPermissionList = getPermissionList;
const getRoleList = async () => {
    const data = await db_1.db.role.findMany({
        select: {
            id: true,
            name: true,
        },
    });
    return data;
};
exports.getRoleList = getRoleList;
const getSubjectList = async () => {
    const data = await db_1.db.subject.findMany({
        select: {
            id: true,
            name: true,
        },
    });
    return data;
};
exports.getSubjectList = getSubjectList;
const getScoreCategoryList = async () => {
    const data = await db_1.db.scoreCategory.findMany({
        select: {
            id: true,
            name: true,
        },
    });
    return data;
};
exports.getScoreCategoryList = getScoreCategoryList;
//# sourceMappingURL=list.services.js.map