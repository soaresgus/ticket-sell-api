import { z } from "zod";

export const ticketParamsSchema = z.object({
    id: z.cuid('Ticket ID is required'),
});

export const ticketStatusSchema = z.enum(['AVAILABLE', 'RESERVED', 'SOLD']).default('AVAILABLE');

export const buyTicketSchema = z.object({
    quantity: z.number().min(1).int().positive().default(1),
});

export const createTicketSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    price: z.number().min(0).positive(),
    quantity: z.number().min(1).int().positive().default(1),
});

export type CreateTicketDTO = z.infer<typeof createTicketSchema>;

