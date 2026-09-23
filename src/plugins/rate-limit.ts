import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';
import { Redis } from 'ioredis';
import type { FastifyInstance } from 'fastify';
import { config } from '../config.js';

async function rateLimitPlugin(app: FastifyInstance) {
    const redis = new Redis(config.redisUrl);

    app.addHook('onClose', async () => {
        await redis.quit();
    })

    await app.register(rateLimit, {
        global: true,
        max: 100,
        timeWindow: '1 minute',
        redis,
        nameSpace: 'ticket-sell-rl-',
        errorResponseBuilder: (_request, context) => ({
            success: false,
            data: null,
            message: `Too many requests. Retry after ${context.after}.`,
            code: 'RATE_LIMIT_EXCEEDED'
        })
    })
}

export default fp(rateLimitPlugin, {
    name: 'rate-limit'
});
