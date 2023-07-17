"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findContactGroupById = exports.findContactGrupByName = exports.deleteContactGroup = exports.addContactGroup = exports.viewAllContactGroups = void 0;
const db_1 = require("../../utils/db");
const viewAllContactGroups = async (query, userId) => {
    const paginate = parseInt(query.show) || 10;
    const page = parseInt(query.page) || 1;
    const contactGroups = await db_1.db.contactGroup.findMany({
        where: {
            name: {
                contains: query.name || "",
                mode: "insensitive",
            },
            user: {
                id: userId,
            },
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
        },
        take: paginate,
        skip: paginate * (page - 1),
    });
    const count = await db_1.db.contactGroup.count({
        where: {
            name: {
                contains: query.name || "",
                mode: "insensitive",
            },
        },
    });
    return {
        data: contactGroups,
        totalPage: Math.ceil(count / paginate).toString(),
        page: query.page || "1",
    };
};
exports.viewAllContactGroups = viewAllContactGroups;
// add contact group
const addContactGroup = async (data) => {
    const contactGroup = await db_1.db.contactGroup.create({
        data: {
            user: {
                connect: { id: data.user },
            },
            name: data.name,
            description: data.description,
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
        },
    });
    return contactGroup;
};
exports.addContactGroup = addContactGroup;
// delete contact group
const deleteContactGroup = async (id) => {
    const contactGroup = await db_1.db.contactGroup.delete({
        where: {
            id: id,
        },
    });
    return contactGroup;
};
exports.deleteContactGroup = deleteContactGroup;
const findContactGrupByName = async (name) => {
    const contactGroup = await db_1.db.contactGroup.findFirst({
        where: {
            name: name,
        },
    });
    return contactGroup;
};
exports.findContactGrupByName = findContactGrupByName;
const findContactGroupById = async (id) => {
    const contactGroup = await db_1.db.contactGroup.findUnique({
        where: {
            id: id,
        },
    });
    return contactGroup;
};
exports.findContactGroupById = findContactGroupById;
//# sourceMappingURL=contactGroup.services.js.map