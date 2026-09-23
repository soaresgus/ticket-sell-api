import type { FastifyInstance } from "fastify";

export default function healthRoutes(fastify: FastifyInstance) {
    fastify.get('/health', async () => ({ status: 'ok' }));
}
