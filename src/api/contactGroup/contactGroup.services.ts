import { db } from "../../utils/db";
import { Prisma } from "@prisma/client";

const viewAllContactGroups = async (query: any, userId: string) => {
  const paginate = parseInt(query.show) || 10;
  const page = parseInt(query.page) || 1;

  const contactGroups = await db.contactGroup.findMany({
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

  const count = await db.contactGroup.count({
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

// add contact group
const addContactGroup = async (data: Prisma.ContactGroupCreateInput) => {
  const contactGroup = await db.contactGroup.create({
    data: {
      user: {
        connect: { id: data.user as any },
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

// delete contact group
const deleteContactGroup = async (id: string) => {
  const contactGroup = await db.contactGroup.delete({
    where: {
      id: id,
    },
  });

  return contactGroup;
};

const findContactGrupByName = async (name: string) => {
  const contactGroup = await db.contactGroup.findFirst({
    where: {
      name: name,
    },
  });

  return contactGroup;
};

const findContactGroupById = async (id: string) => {
  const contactGroup = await db.contactGroup.findUnique({
    where: {
      id: id,
    },
  });

  return contactGroup;
};

export {
  viewAllContactGroups,
  addContactGroup,
  deleteContactGroup,
  findContactGrupByName,
  findContactGroupById,
};
