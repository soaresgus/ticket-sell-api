import { AppError } from "../../errors/app-error.js";
import { TicketStatus, type Ticket, type TicketReservation } from "../../generated/prisma/client.js";
import type { TicketsRepository } from "./tickets.repository.js";
import type { CreateTicketDTO } from "./tickets.schema.js";

export class TicketsService {
    constructor(private readonly ticketsRepository: TicketsRepository) { }

    async listTickets(): Promise<Ticket[]> {
        try {
            return await this.ticketsRepository.listTickets();
        } catch (error) {
            throw error;
        }
    }

    async getTicketById(id: string): Promise<Ticket | null> {
        try {
            const ticket = await this.ticketsRepository.getTicketById(id);

            if (!ticket) {
                throw new AppError('Ticket not found.', 404, 'TICKET_NOT_FOUND');
            }
            return ticket;
        } catch (error) {
            throw error;
        }
    }

    async getTicketReservation(ticketId: string, userId: string): Promise<TicketReservation | null> {
        try {
            const ticket = await this.getTicketById(ticketId);

            if (!ticket) {
                throw new AppError('Ticket not found.', 404, 'TICKET_NOT_FOUND');
            }

            const reservation = await this.ticketsRepository.getReservationByTicketIdAndUserId(ticketId, userId);

            if (!reservation) {
                throw new AppError('Reservation not found.', 404, 'RESERVATION_NOT_FOUND');
            }

            return reservation;
        } catch (error) {
            throw error;
        }
    }

    async createTicket(data: CreateTicketDTO): Promise<Ticket> {
        try {
            return await this.ticketsRepository.createTicket(data);
        } catch (error) {
            throw error;
        }
    }
}
