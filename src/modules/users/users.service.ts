import { AppError } from "../../errors/app-error.js";
import { Prisma, TicketStatus } from "../../generated/prisma/client.js";
import type { UsersRepository } from "./users.repository.js";
import type { CreateUserSchema, LoginSchema } from "./users.schema.js";
import bcrypt from "bcrypt";

export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async createUser(user: CreateUserSchema) {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        try {
            return await this.usersRepository.create({
                ...user,
                password: hashedPassword,
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                throw new AppError("User already exists", 409, "USER_ALREADY_EXISTS");
            }

            throw error;
        }
    }

    async login(data: LoginSchema) {
        try {
            const { email, password } = data;

            const user = await this.usersRepository.findByEmail(email);

            if (!user) {
                throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    async me(userEmail: string) {
        try {
            const user = await this.usersRepository.findByEmail(userEmail);

            if (!user) {
                throw new AppError("The user associated with this access token no longer exists.", 401, "USER_NOT_FOUND");
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } catch (error) {
            throw error;
        }
    }

    async getTicketsByUserId(userId: string) {
        try {
            const { reservations, purchases } = await this.usersRepository.findTicketsByUserId(userId);

            const reservationsData = reservations.map((reservation) => {
                return {
                    ...reservation,
                    status: TicketStatus.RESERVED
                }
            })

            const purchasesData = purchases.map((purchase) => {
                return {
                    ...purchase,
                    status: TicketStatus.SOLD
                }
            })

            return { reservations: reservationsData, purchases: purchasesData };
        } catch (error) {
            throw error;
        }
    }
}
