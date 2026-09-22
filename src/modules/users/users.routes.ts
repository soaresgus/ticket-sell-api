import type { FastifyInstance } from "fastify";
import { UsersRepository } from "./users.repository.js";
import { UsersService } from "./users.service.js";
import { createUserSchema, loginSchema } from "./users.schema.js";
import { ZodError } from "zod";
import { AppError } from "../../errors/app-error.js";
import { config } from "../../config.js";

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
                    { sub: user.id, email: user.email},
                    { expiresIn: config.jwtExpiresIn }
                );

                const refreshToken = fastify.jwt.sign(
                    { sub: user.id, email: user.email},
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
                if(error instanceof ZodError) {
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
}
