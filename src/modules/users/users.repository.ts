import type { PrismaClient } from "../../generated/prisma/client.js";

export class UsersRepository {
    constructor(private readonly prisma: PrismaClient) {}

    create(data: { name: string; email: string; password: string }) {
        return this.prisma.user.create({
            data,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            },
        });
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email: email
            },
        });
    }
}
