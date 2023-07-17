"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBroadcast = exports.viewAllBroadcasts = void 0;
const db_1 = require("../../utils/db");
const viewAllBroadcasts = async (query, userId) => {
    const paginate = parseInt(query.show) || 10;
    const skipData = (parseInt(query.page) - 1) * paginate || 0;
    const broadcast = await db_1.db.broadcastMessage.findMany({
        skip: skipData,
        where: {
            title: {
                contains: query.name || "",
                mode: "insensitive",
            },
            user: {
                id: userId,
            },
        },
        select: {
            id: true,
            title: true,
            number: true,
            type: true,
            status: true,
            message: true,
            createdAt: true,
        },
        take: paginate,
    });
    const count = await db_1.db.broadcastMessage.count({
        where: {
            title: {
                contains: query.name || "",
                mode: "insensitive",
            },
            user: {
                id: userId,
            },
        },
    });
    return {
        data: broadcast,
        totalPage: Math.ceil(count / paginate).toString(),
        page: query.page || "1",
    };
};
exports.viewAllBroadcasts = viewAllBroadcasts;
const createBroadcast = async (data) => {
    const broadcast = await db_1.db.broadcastMessage.create({
        data: {
            user: {
                connect: { id: data.user },
            },
            title: data.title,
            type: data.type,
            number: data.number,
            status: data.status,
            imageUrl: data.imageUrl,
            message: data.message,
        },
        select: {
            id: true,
            title: true,
            type: true,
            status: true,
            message: true,
            createdAt: true,
        },
    });
    return broadcast;
};
exports.createBroadcast = createBroadcast;
//# sourceMappingURL=broadcast.services.js.map