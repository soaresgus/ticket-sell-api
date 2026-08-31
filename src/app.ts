import Fastify from 'fastify';

export function buildApp(logger = false) {
  const app = Fastify({ logger });

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}
