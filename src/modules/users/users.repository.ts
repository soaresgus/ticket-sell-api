import type { PrismaClient } from "../../generated/prisma/client.js";

export class UsersRepository {
    constructor(private readonly prisma: PrismaClient) { }

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

    async findTicketsByUserId(userId: string) {
        const reservations = await this.prisma.ticketReservation.findMany({
            where: {
                userId: userId
            },
            include: {
                Ticket: true
            }
        });

        const purchases = await this.prisma.ticketPurchaser.findMany({
            where: {
                userId: userId
            },
            include: {
                Ticket: true
            }
        });

        return { reservations, purchases };
    }
}
