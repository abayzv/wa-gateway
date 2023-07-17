"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRolePermissionExist = exports.deleteRolePermission = exports.assignRolePermission = exports.findRoleById = exports.findRoleByName = exports.deleteRole = exports.updateRole = exports.createRole = exports.showRole = exports.viewAllRoles = void 0;
const db_1 = require("../../utils/db");
const viewAllRoles = async (query) => {
    const paginate = +query.show || 10;
    const skipData = (+query.page - 1) * paginate || 0;
    const role = await db_1.db.role.findMany({
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
            createdAt: true,
            updatedAt: true,
        },
    });
    const count = await db_1.db.role.count({
        where: {
            name: {
                contains: query.name || "",
                mode: "insensitive",
            },
        },
    });
    return {
        data: role,
        totalPage: Math.ceil(count / paginate).toString(),
        page: query.page || "1",
    };
};
exports.viewAllRoles = viewAllRoles;
const findRoleByName = (name) => {
    return db_1.db.role.findFirst({
        where: {
            name,
        },
    });
};
exports.findRoleByName = findRoleByName;
const findRoleById = (id) => {
    return db_1.db.role.findUnique({
        where: {
            id,
        },
        select: {
            name: true,
            permissions: {
                select: {
                    permission: {
                        select: {
                            name: true,
                            action: true,
                            menu: true,
                        },
                    },
                },
            },
        },
    });
};
exports.findRoleById = findRoleById;
const showRole = (id) => {
    return db_1.db.role.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.showRole = showRole;
const createRole = (role) => {
    return db_1.db.role.create({
        data: {
            name: role.name,
        },
    });
};
exports.createRole = createRole;
const updateRole = (role) => {
    return db_1.db.role.update({
        where: {
            id: role.id,
        },
        data: {
            name: role.name,
        },
    });
};
exports.updateRole = updateRole;
const deleteRole = (id) => {
    return db_1.db.role.delete({
        where: {
            id,
        },
    });
};
exports.deleteRole = deleteRole;
const assignRolePermission = (rolePermission) => {
    return db_1.db.rolePermission.createMany({
        data: rolePermission,
    });
};
exports.assignRolePermission = assignRolePermission;
const deleteRolePermission = (rolePermission) => {
    return db_1.db.rolePermission.deleteMany({
        where: {
            OR: rolePermission,
        },
    });
};
exports.deleteRolePermission = deleteRolePermission;
const isRolePermissionExist = (rolePermission) => {
    return db_1.db.rolePermission.findMany({
        where: {
            OR: rolePermission,
        },
        select: {
            permission: {
                select: {
                    name: true,
                },
            },
        },
    });
};
exports.isRolePermissionExist = isRolePermissionExist;
//# sourceMappingURL=role.services.js.map