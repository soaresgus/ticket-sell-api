import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { buildApp } from '../app.js';

describe('Authentication', () => {
    const app = buildApp();

    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    describe('Register', () => {
        describe('Success', () => {
            it('should create a new user and not return the password with 201 status code', async () => {
                const email = `jhon.doe${Math.random()}@example.com`;

                const response = await app.inject({
                    method: 'POST',
                    url: '/api/v1/auth/register',
                    payload: {
                        name: 'John Doe',
                        email,
                        password: 'password',
                    },
                });

                expect(response.statusCode).toBe(201);
                expect(response.json()).toMatchObject({
                    success: true,
                    code: 'USER_CREATED',
                    data: {
                        name: 'John Doe',
                        email,
                    }
                });
                expect(response.json().data.password).toBeUndefined();
            })
        })

        describe('Failure', () => {
            it('should not create a new user with an invalid email and return a validation error with 422 status code', async () => {
                const response = await app.inject({
                    method: 'POST',
                    url: '/api/v1/auth/register',
                    payload: {
                        name: 'John Doe',
                        email: 'invalid-email',
                        password: 'password',
                    },
                });

                expect(response.statusCode).toBe(422);
                expect(response.json()).toMatchObject({
                    success: false,
                    code: 'VALIDATION_ERROR',
                });
            })

            it('should not create a new user with a password less than 8 characters and return a validation error with 422 status code', async () => {
                const email = `jhon.doe${Math.random()}@example.com`;

                const response = await app.inject({
                    method: 'POST',
                    url: '/api/v1/auth/register',
                    payload: {
                        name: 'John Doe',
                        email,
                        password: 'pass',
                    },
                });

                expect(response.statusCode).toBe(422);
                expect(response.json()).toMatchObject({
                    success: false,
                    code: 'VALIDATION_ERROR',
                });
            });

            it('should not create a new user with a required field missing and return a validation error with 422 status code', async () => {
                const response = await app.inject({
                    method: 'POST',
                    url: '/api/v1/auth/register',
                    payload: {
                        name: 'John Doe',
                    },
                });

                expect(response.statusCode).toBe(422);
                expect(response.json()).toMatchObject({
                    success: false,
                    code: 'VALIDATION_ERROR',
                });
            });

            it('should not create a new user with a duplicate email and return a conflict error with 409 status code', async () => {
                const email = `jhon.doe${Math.random()}@example.com`;

                await app.inject({
                    method: 'POST',
                    url: '/api/v1/auth/register',
                    payload: {
                        name: 'John Doe',
                        email,
                        password: 'password',
                    },
                });

                const response = await app.inject({
                    method: 'POST',
                    url: '/api/v1/auth/register',
                    payload: {
                        name: 'John Doe',
                        email,
                        password: 'password',
                    },
                });

                expect(response.statusCode).toBe(409);
                expect(response.json()).toMatchObject({
                    success: false,
                    code: 'USER_ALREADY_EXISTS',
                });
            });
        })
    })

    describe('Login', () => {
        describe('Success', () => {
            it('should login a user and return a token with 200 status code', async () => {
                const email = `jhon.doe${Math.random()}@example.com`;

                const user = {
                    name: 'John Doe',
                    email,
                    password: 'password',
                }

                await app.inject({
                    method: 'POST',
                    url: '/api/v1/auth/register',
                    payload: {
                        name: user.name,
                        email: user.email,
                        password: user.password,
                    },
                });

                const response = await app.inject({
                    method: 'POST',
                    url: '/api/v1/auth/login',
                    payload: {
                        email: user.email,
                        password: user.password,
                    },
                });

                expect(response.statusCode).toBe(200);
                expect(response.json()).toMatchObject({
                    success: true,
                    code: 'LOGIN_SUCCESS',
                    data: {
                        token: expect.any(String),
                        refreshToken: expect.any(String),
                    },
                });
                expect(response.json().data.token).toBeDefined();
                expect(response.json().data.refreshToken).toBeDefined();
            })
        })

        describe('Failure', () => {
            it('should not login a user with an invalid email and return a validation error with 422 status code', async () => {
                const response = await app.inject({
                    method: 'POST',
                    url: '/api/v1/auth/login',
                    payload: {
                        email: 'invalid-email',
                        password: 'password',
                    },
                });

                expect(response.statusCode).toBe(422);
                expect(response.json()).toMatchObject({
                    success: false,
                    code: 'VALIDATION_ERROR',
                });
            });

            it('should not login a user with incorrect password and return a invalid credentials error with 401 status code', async () => {
                const email = `jhon.doe${Math.random()}@example.com`;

                const user = {
                    name: 'John Doe',
                    email,
                    password: 'password',
                }

                await app.inject({
                    method: 'POST',
                    url: '/api/v1/auth/register',
                    payload: {
                        name: user.name,
                        email: user.email,
                        password: user.password,
                    },
                });

                const response = await app.inject({
                    method: 'POST',
                    url: '/api/v1/auth/login',
                    payload: {
                        email: user.email,
                        password: 'incorrect-password',
                    },
                });

                expect(response.statusCode).toBe(401);
                expect(response.json()).toMatchObject({
                    success: false,
                    code: 'INVALID_CREDENTIALS',
                });
            })
        })
    })
});
