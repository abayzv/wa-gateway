import { db } from "../../utils/db";
import { Prisma } from "@prisma/client";

const viewAllContacts = async (
  query: {
    name?: string;
    page: number;
    show: number;
  },
  userId: string
) => {
  const paginate = +query.show || 10;
  const skipData = (+query.page - 1) * paginate || 0;

  const contact = await db.contact.findMany({
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

  const count = await db.contact.count({
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

const viewContact = async (id: string) => {
  const contact = await db.contact.findUnique({
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

const findContactByName = async (name: string) => {
  const contact = await db.contact.findFirst({
    where: {
      name: name,
    },
  });

  return contact;
};

const createContact = async (data: Prisma.ContactCreateInput) => {
  const contact = await db.contact.create({
    data: {
      user: {
        connect: { id: data.user as any },
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

const updateContact = async (id: string, data: Prisma.ContactUpdateInput) => {
  const contact = await db.contact.update({
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

const deleteContact = async (id: string) => {
  const contact = await db.contact.delete({
    where: {
      id: id,
    },
  });

  return contact;
};

export {
  viewAllContacts,
  viewContact,
  createContact,
  updateContact,
  deleteContact,
  findContactByName,
};
