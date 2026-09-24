import type { PrismaClient, Ticket, TicketReservation, TicketStatus } from "../../generated/prisma/client.js";

export class TicketsRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async listTickets(): Promise<Ticket[]> {
        return this.prisma.ticket.findMany()
    }

    async getTicketById(id: string): Promise<Ticket | null> {
        return this.prisma.ticket.findUnique({
            where: {
                id,
            },
        })
    }

    async getTicketQuantityByStatus(id: string, status: TicketStatus): Promise<number> {
        return this.prisma.ticket.count({
            where: {
                id,
                status,
            },
        })
    }

    async getReservationByTicketIdAndUserId(ticketId: string, userId: string): Promise<TicketReservation | null> {
        return this.prisma.ticketReservation.findFirst({
            where: {
                ticketId,
                userId,
            },
        })
    }
}
