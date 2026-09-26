import type { FastifyInstance } from "fastify";
import { UsersRepository } from "./users.repository.js";
import { UsersService } from "./users.service.js";
import { createUserSchema, loginSchema, refreshTokenSchema } from "./users.schema.js";
import { ZodError } from "zod";
import { AppError } from "../../errors/app-error.js";
import { config } from "../../config.js";
import { TicketStatus } from "../../generated/prisma/enums.js";

export default async function usersRoutes(fastify: FastifyInstance) {
    const usersRepository = new UsersRepository(fastify.prisma);
    const usersService = new UsersService(usersRepository);

    fastify.post("/auth/register", {
        handler: async (request, reply) => {
            try {
                const { name, email, password } = createUserSchema.parse(request.body);
                const user = await usersService.createUser({ name, email, password });
                return reply.status(201).send({
                    success: true,
                    data: user,
                    message: "User created successfully",
                    code: "USER_CREATED"
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
                request.log.error(error);
                return reply.status(500).send({
                    success: false,
                    data: null,
                    message: "Internal server error",
                    code: "INTERNAL_SERVER_ERROR"
                });
            }
        },
    });

    fastify.post("/auth/login", {
        handler: async (request, reply) => {
            try {
                const { email, password } = loginSchema.parse(request.body);
                const user = await usersService.login({ email, password });

                const accessToken = fastify.jwt.sign(
                    { sub: user.id, email: user.email },
                    { expiresIn: config.jwtExpiresIn }
                );

                const refreshToken = fastify.jwt.sign(
                    { sub: user.id, email: user.email },
                    { expiresIn: config.jwtRefreshExpiresIn }
                );

                return reply.status(200).send({
                    success: true,
                    data: {
                        token: accessToken,
                        refreshToken,
                    },
                    message: "Login successful.",
                    code: "LOGIN_SUCCESS",
                })
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
                request.log.error(error);
                return reply.status(500).send({
                    success: false,
                    data: null,
                    message: "Internal server error",
                    code: "INTERNAL_SERVER_ERROR"
                });
            }
        }
    })

    fastify.post("/auth/refresh", {
        handler: async (request, reply) => {
            try {
                const { refreshToken } = refreshTokenSchema.parse(request.body);

                const decoded = fastify.jwt.verify(refreshToken) as { sub: string; email: string };

                if (!decoded) {
                    return reply.status(401).send({
                        success: false,
                        data: null,
                        message: "The refresh token is invalid or has expired. Please log in again.",
                        code: "INVALID_REFRESH_TOKEN"
                    });
                }

                const user = await usersRepository.findByEmail(decoded.email);

                if (!user) {
                    return reply.status(401).send({
                        success: false,
                        data: null,
                        message: "The user associated with this refresh token no longer exists.",
                        code: "USER_NOT_FOUND"
                    });
                }

                const accessToken = fastify.jwt.sign({ sub: user.id, email: user.email })

                return reply.status(200).send({
                    success: true,
                    data: {
                        token: accessToken,
                    },
                    message: "Token refreshed successfully.",
                    code: "TOKEN_REFRESHED"
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
                request.log.error(error);
                return reply.status(500).send({
                    success: false,
                    data: null,
                    message: "Internal server error",
                    code: "INTERNAL_SERVER_ERROR"
                });
            }
        }
    });

    fastify.get("/users/me", {
        onRequest: [fastify.authenticate],
        handler: async (request, reply) => {
            try {
                if (!request.headers.authorization) {
                    return reply.status(401).send({
                        success: false,
                        data: null,
                        message: "Authentication required. Please provide a valid Bearer token.",
                        code: "UNAUTHORIZED"
                    });
                }

                const user = await usersService.me(request.user.email);

                return reply.status(200).send({
                    success: true,
                    data: user,
                    message: "User profile fetched successfully",
                    code: "USER_FETCHED"
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
                request.log.error(error);
                return reply.status(500).send({
                    success: false,
                    data: null,
                    message: "Internal server error",
                    code: "INTERNAL_SERVER_ERROR"
                });
            }
        }
    });

    fastify.get("/users/me/tickets", {
        onRequest: [fastify.authenticate],
        handler: async (request, reply) => {
            try {
                const tickets = await usersService.getTicketsByUserId(request.user.id);

                return reply.status(200).send({
                    success: true,
                    data: tickets,
                    message: "User tickets fetched successfully.",
                    code: "USER_TICKETS_FETCHED"
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
                request.log.error(error);
                return reply.status(500).send({
                    success: false,
                    data: null,
                    message: "Internal server error",
                    code: "INTERNAL_SERVER_ERROR"
                });
            }
        }
    });
}
