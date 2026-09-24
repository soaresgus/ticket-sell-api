import { z } from "zod";

export const ticketIdSchema = z.cuid2('Ticket ID is required');

export const ticketStatusSchema = z.enum(['AVAILABLE', 'RESERVED', 'SOLD']).default('AVAILABLE');

export const buyTicketSchema = z.object({
    quantity: z.number().min(1).int().positive().default(1),
});


