import { db } from "../../utils/db";
import { Prisma } from "@prisma/client";

const viewAllBroadcasts = async (
  query: {
    name?: string;
    page: string;
    show: string;
  },
  userId: string
) => {
  const paginate = parseInt(query.show) || 10;
  const skipData = (parseInt(query.page) - 1) * paginate || 0;

  const broadcast = await db.broadcastMessage.findMany({
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

  const count = await db.broadcastMessage.count({
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

const createBroadcast = async (data: Prisma.BroadcastMessageCreateInput) => {
  const broadcast = await db.broadcastMessage.create({
    data: {
      user: {
        connect: { id: data.user as any },
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

export { viewAllBroadcasts, createBroadcast };
