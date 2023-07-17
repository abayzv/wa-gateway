"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const list_services_1 = require("./list.services");
const router = express_1.default.Router();
// Get all teachers
router.get("/teachers", async (req, res, next) => {
    try {
        const teachers = await (0, list_services_1.getTeacherList)();
        const data = teachers.map((teacher) => {
            return {
                value: teacher.id,
                label: teacher.name,
            };
        });
        res.json({ data });
    }
    catch (error) {
        next(error);
    }
});
// Get all classrooms
router.get("/classrooms", async (req, res, next) => {
    try {
        const classrooms = await (0, list_services_1.getClassroomList)();
        const data = classrooms.map((classroom) => {
            return {
                value: classroom.id,
                label: classroom.name,
            };
        });
        res.json({ data });
    }
    catch (error) {
        next(error);
    }
});
// Get all permissions
router.get("/permissions", async (req, res, next) => {
    try {
        const permissions = await (0, list_services_1.getPermissionList)();
        const data = permissions.map((permission) => {
            return {
                value: permission.id,
                label: permission.name,
            };
        });
        res.json({ data });
    }
    catch (error) {
        next(error);
    }
});
// Get all roles
router.get("/roles", async (req, res, next) => {
    try {
        const roles = await (0, list_services_1.getRoleList)();
        const data = roles.map((role) => {
            return {
                value: role.id,
                label: role.name,
            };
        });
        res.json({ data });
    }
    catch (error) {
        next(error);
    }
});
// Get all subjects
router.get("/subjects", async (req, res, next) => {
    try {
        const subjects = await (0, list_services_1.getSubjectList)();
        const data = subjects.map((subject) => {
            return {
                value: subject.id,
                label: subject.name,
            };
        });
        res.json({ data });
    }
    catch (error) {
        next(error);
    }
});
// Get all score categories
router.get("/score-categories", async (req, res, next) => {
    try {
        const scoreCategories = await (0, list_services_1.getScoreCategoryList)();
        const data = scoreCategories.map((scoreCategory) => {
            return {
                value: scoreCategory.id,
                label: scoreCategory.name,
            };
        });
        res.json({ data });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=list.routes.js.map