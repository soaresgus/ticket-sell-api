import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string("Name is required").min(1, "Name is required"),
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string("Password is required").min(8, "Password must be at least 8 characters long"),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const loginSchema = z.object({
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string("Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
    refreshToken: z.jwt("Invalid refresh token").min(1, "Refresh token is required"),
});

export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;

export const logoutSchema = z.object({
    refreshToken: z.jwt("Invalid refresh token").min(1, "Refresh token is required"),
});

export type LogoutSchema = z.infer<typeof logoutSchema>;

