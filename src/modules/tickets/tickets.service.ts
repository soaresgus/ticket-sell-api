import { AppError } from "../../errors/app-error.js";
import { TicketStatus, type Ticket, type TicketReservation } from "../../generated/prisma/client.js";
import type { TicketsRepository } from "./tickets.repository.js";

export class TicketsService {
    constructor(private readonly ticketsRepository: TicketsRepository) { }

    async listTickets(): Promise<Ticket[]> {
        return this.ticketsRepository.listTickets();
    }

    async getTicketById(id: string): Promise<Ticket | null> {
        const ticket = await this.ticketsRepository.getTicketById(id);

        if (!ticket) {
            throw new AppError('Ticket not found.', 404, 'TICKET_NOT_FOUND');
        }
        return ticket;
    }

    async getTicketQuantityForAllStatuses(id: string): Promise<Record<TicketStatus, number>> {
        const ticket = await this.getTicketById(id);

        if (!ticket) {
            throw new AppError('Ticket not found.', 404, 'TICKET_NOT_FOUND');
        }

        return {
            AVAILABLE: await this.ticketsRepository.getTicketQuantityByStatus(id, TicketStatus.AVAILABLE),
            RESERVED: await this.ticketsRepository.getTicketQuantityByStatus(id, TicketStatus.RESERVED),
            SOLD: await this.ticketsRepository.getTicketQuantityByStatus(id, TicketStatus.SOLD),
        };
    }

    async getTicketReservation(ticketId: string, userId: string): Promise<TicketReservation | null> {
        const ticket = await this.getTicketById(ticketId);

        if (!ticket) {
            throw new AppError('Ticket not found.', 404, 'TICKET_NOT_FOUND');
        }

        const reservation = await this.ticketsRepository.getReservationByTicketIdAndUserId(ticketId, userId);

        if (!reservation) {
            throw new AppError('Reservation not found.', 404, 'RESERVATION_NOT_FOUND');
        }

        return reservation;
    }
}
