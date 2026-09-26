import { TicketStatus, type PrismaClient, type Ticket, type TicketReservation } from "../../generated/prisma/client.js";
import type { CreateTicketDTO } from "./tickets.schema.js";

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

    async getReservationByTicketIdAndUserId(ticketId: string, userId: string): Promise<TicketReservation | null> {
        return this.prisma.ticketReservation.findFirst({
            where: {
                ticketId,
                userId,
            },
            include: {
                Ticket: true
            },
        });
    }

    async createTicket(data: CreateTicketDTO): Promise<Ticket> {
        return this.prisma.ticket.create({
            data: {
                title: data.title,
                description: data.description ?? null,
                price: data.price,
                quantity: data.quantity,
            },
        });
    }
}
