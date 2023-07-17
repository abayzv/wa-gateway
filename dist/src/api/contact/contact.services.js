"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findContactByName = exports.deleteContact = exports.updateContact = exports.createContact = exports.viewContact = exports.viewAllContacts = void 0;
const db_1 = require("../../utils/db");
const viewAllContacts = async (query, userId) => {
    const paginate = +query.show || 10;
    const skipData = (+query.page - 1) * paginate || 0;
    const contact = await db_1.db.contact.findMany({
        take: paginate,
        skip: skipData,
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
            group: true,
            createdAt: true,
        },
    });
    const count = await db_1.db.contact.count({
        where: {
            name: {
                contains: query.name || "",
                mode: "insensitive",
            },
        },
    });
    return {
        data: contact,
        totalPage: Math.ceil(count / paginate).toString(),
        page: query.page || "1",
    };
};
exports.viewAllContacts = viewAllContacts;
const viewContact = async (id) => {
    const contact = await db_1.db.contact.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            group: true,
            createdAt: true,
        },
    });
    return contact;
};
exports.viewContact = viewContact;
const findContactByName = async (name) => {
    const contact = await db_1.db.contact.findFirst({
        where: {
            name: name,
        },
    });
    return contact;
};
exports.findContactByName = findContactByName;
const createContact = async (data) => {
    const contact = await db_1.db.contact.create({
        data: {
            user: {
                connect: { id: data.user },
            },
            name: data.name,
            phoneNumber: data.phoneNumber,
        },
        select: {
            id: true,
            name: true,
            group: true,
            createdAt: true,
        },
    });
    return contact;
};
exports.createContact = createContact;
const updateContact = async (id, data) => {
    const contact = await db_1.db.contact.update({
        where: {
            id: id,
        },
        data: data,
        select: {
            id: true,
            name: true,
            group: true,
            createdAt: true,
        },
    });
    return contact;
};
exports.updateContact = updateContact;
const deleteContact = async (id) => {
    const contact = await db_1.db.contact.delete({
        where: {
            id: id,
        },
    });
    return contact;
};
exports.deleteContact = deleteContact;
//# sourceMappingURL=contact.services.js.map