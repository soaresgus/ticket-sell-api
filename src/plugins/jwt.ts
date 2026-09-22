import fp from 'fastify-plugin';
import fjwt from '@fastify/jwt';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../config.js';

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { sub: string; email: string }
        user: { id: string; name: string; email: string; createdAt: Date; updatedAt: Date }
    }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

async function jwtPlugin(app: FastifyInstance) {
    await app.register(fjwt, {
        secret: config.jwtSecret,
        sign: { expiresIn: config.jwtExpiresIn }
    });

    app.decorate(
        'authenticate',
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                await request.jwtVerify();
            } catch {
                return reply.status(401).send({
                    success: false,
                    data: null,
                    message: "Unauthorized",
                    code: "UNAUTHORIZED"
                });
            }
        }
    )
}

export default fp(jwtPlugin, {name: 'jwt'});
