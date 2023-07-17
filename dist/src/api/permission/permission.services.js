"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermission = exports.updatePermission = exports.createPermission = exports.showPermission = exports.findPermissionById = exports.findPermissionByName = exports.viewAllPermissions = void 0;
const db_1 = require("../../utils/db");
const viewAllPermissions = async (query) => {
    const paginate = +query.show || 10;
    const skipData = (+query.page - 1) * paginate || 0;
    const permission = await db_1.db.permission.findMany({
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
            // action: true,
            // menu: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const count = await db_1.db.permission.count({
        where: {
            name: {
                contains: query.name || "",
                mode: "insensitive",
            },
        },
    });
    return {
        data: permission,
        totalPage: Math.ceil(count / paginate).toString(),
        page: query.page || "1",
    };
};
exports.viewAllPermissions = viewAllPermissions;
const findPermissionByName = (name) => {
    return db_1.db.permission.findFirst({
        where: {
            name,
        },
    });
};
exports.findPermissionByName = findPermissionByName;
const findPermissionById = (id) => {
    return db_1.db.permission.findUnique({
        where: {
            id,
        },
    });
};
exports.findPermissionById = findPermissionById;
const showPermission = (id) => {
    return db_1.db.permission.findUnique({
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
exports.showPermission = showPermission;
const createPermission = (permission) => {
    return db_1.db.permission.create({
        data: {
            name: permission.name,
            action: permission.action,
            menu: permission.menu,
        },
    });
};
exports.createPermission = createPermission;
const updatePermission = ({ permissionId, permission, }) => {
    return db_1.db.permission.update({
        where: {
            id: permissionId,
        },
        data: {
            name: permission.name,
            action: permission.action,
            menu: permission.menu,
        },
    });
};
exports.updatePermission = updatePermission;
const deletePermission = (id) => {
    return db_1.db.permission.delete({
        where: {
            id,
        },
    });
};
exports.deletePermission = deletePermission;
//# sourceMappingURL=permission.services.js.map