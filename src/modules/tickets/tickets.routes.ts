import type { FastifyInstance } from "fastify";
import { TicketsRepository } from "./tickets.repository.js";
import { TicketsService } from "./tickets.service.js";
import { AppError } from "../../errors/app-error.js";
import { createTicketSchema, ticketParamsSchema } from "./tickets.schema.js";
import { ZodError } from "zod";

export default async function ticketsRoutes(fastify: FastifyInstance) {
    const ticketsRepository = new TicketsRepository(fastify.prisma);
    const ticketsService = new TicketsService(ticketsRepository);

    fastify.get("/tickets", {
        handler: async (request, reply) => {
            try {
                const tickets = await ticketsService.listTickets();
                return reply.status(200).send({
                    success: true,
                    data: tickets,
                    message: "Tickets fetched successfully",
                    code: "TICKETS_FETCHED"
                });
            } catch (error) {
                if (error instanceof AppError) {
                    return reply.status(error.statusCode).send({
                        success: false,
                        data: null,
                        message: error.message,
                        code: error.code
                    });
                }

                return reply.status(500).send({
                    success: false,
                    data: null,
                    message: "Internal server error",
                    code: "INTERNAL_SERVER_ERROR"
                });
            }
        }
    })

    fastify.get("/tickets/:id", {
        handler: async (request, reply) => {
            try {
                const { id } = ticketParamsSchema.parse(request.params);
                const ticket = await ticketsService.getTicketById(id);
                return reply.status(200).send({
                    success: true,
                    data: ticket,
                    message: "Ticket fetched successfully",
                    code: "TICKET_FETCHED"
                });
            } catch (error) {
                if (error instanceof AppError) {
                    return reply.status(error.statusCode).send({
                        success: false,
                        data: null,
                        message: error.message,
                        code: error.code
                    });
                }
                if (error instanceof ZodError) {
                    return reply.status(422).send({
                        success: false,
                        data: null,
                        message: "One or more fields are invalid or missing.",
                        code: "VALIDATION_ERROR",
                        issues: error.issues
                    });
                }
                return reply.status(500).send({
                    success: false,
                    data: null,
                    message: "Internal server error",
                    code: "INTERNAL_SERVER_ERROR"
                });
            }
        }
    })

    fastify.get("/tickets/:id/reservation", {
        onRequest: [fastify.authenticate],
        handler: async (request, reply) => {
            try {
                const { id } = ticketParamsSchema.parse(request.params);
                const userId = request.user.id;
                const reservation = await ticketsService.getTicketReservation(id, userId);

                return reply.status(200).send({
                    success: true,
                    data: reservation,
                    message: "Ticket reservation fetched successfully",
                    code: "TICKET_RESERVATION_FETCHED"
                });
            }
            catch (error) {
                if (error instanceof AppError) {
                    return reply.status(error.statusCode).send({
                        success: false,
                        data: null,
                        message: error.message,
                        code: error.code
                    });
                }
                if (error instanceof ZodError) {
                    return reply.status(422).send({
                        success: false,
                        data: null,
                        message: "One or more fields are invalid or missing.",
                        code: "VALIDATION_ERROR",
                        issues: error.issues
                    });
                }
                return reply.status(500).send({
                    success: false,
                    data: null,
                    message: "Internal server error",
                    code: "INTERNAL_SERVER_ERROR"
                });
            }
        }
    })

    fastify.post("/tickets", {
        onRequest: [fastify.authenticate],
        handler: async (request, reply) => {
            try {
                const data = createTicketSchema.parse(request.body);

                const ticket = await ticketsService.createTicket(data);

                return reply.status(201).send({
                    success: true,
                    data: ticket,
                    message: "Ticket created successfully",
                    code: "TICKET_CREATED"
                });
            }
            catch (error) {
                if (error instanceof AppError) {
                    return reply.status(error.statusCode).send({
                        success: false,
                        data: null,
                        message: error.message,
                        code: error.code
                    });
                }
                if (error instanceof ZodError) {
                    return reply.status(422).send({
                        success: false,
                        data: null,
                        message: "One or more fields are invalid or missing.",
                        code: "VALIDATION_ERROR",
                        issues: error.issues
                    });
                }
                return reply.status(500).send({
                    success: false,
                    data: null,
                    message: "Internal server error",
                    code: "INTERNAL_SERVER_ERROR"
                });
            }
        }
    })
}
