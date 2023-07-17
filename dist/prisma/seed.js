"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    // create some permissions
    const create = await prisma.permission.create({
        data: {
            name: "Create User",
            action: "POST",
            menu: "user",
        },
    });
    const read = await prisma.permission.create({
        data: {
            name: "View User",
            action: "GET",
            menu: "user",
        },
    });
    const update = await prisma.permission.create({
        data: {
            name: "Update User",
            action: "PUT",
            menu: "user",
        },
    });
    const delete_ = await prisma.permission.create({
        data: {
            name: "Delete User",
            action: "DELETE",
            menu: "user",
        },
    });
    // Create some roles
    const superadmin = await prisma.role.create({
        data: {
            name: "superadmin",
        },
    });
    const admin = await prisma.role.create({
        data: {
            name: "admin",
        },
    });
    const user = await prisma.role.create({
        data: {
            name: "user",
        },
    });
    // create some role permission
    const adminPermission = await prisma.rolePermission.createMany({
        data: [
            {
                roleId: admin.id,
                permissionId: create.id,
            },
            {
                roleId: admin.id,
                permissionId: read.id,
            },
            {
                roleId: admin.id,
                permissionId: update.id,
            },
            {
                roleId: admin.id,
                permissionId: delete_.id,
            },
        ],
    });
    const userPermission = await prisma.rolePermission.createMany({
        data: [
            {
                roleId: user.id,
                permissionId: read.id,
            },
        ],
    });
    // create user superadmin
    const superadminUser = await prisma.user.create({
        data: {
            email: "super@admin.com",
            password: bcrypt_1.default.hashSync("P@ssw0rd", 12),
            roleID: superadmin.id,
            profile: {
                create: {
                    name: "Super Admin",
                },
            },
        },
    });
    // create user admin
    const adminUser = await prisma.user.create({
        data: {
            email: "admin@admin.com",
            password: bcrypt_1.default.hashSync("P@ssw0rd", 12),
            roleID: admin.id,
            profile: {
                create: {
                    name: "Admin",
                },
            },
        },
    });
    // create user
    const normalUser = await prisma.user.create({
        data: {
            email: "bayu@gmail.com",
            password: bcrypt_1.default.hashSync("P@ssw0rd", 12),
            roleID: user.id,
            profile: {
                create: {
                    name: "Mahesadev",
                },
            },
        },
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map