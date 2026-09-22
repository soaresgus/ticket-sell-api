import Fastify from 'fastify';
import healthRoutes from './modules/health/health.routes.js';
import prismaPlugin from './plugins/prisma.js';
import usersRoutes from './modules/users/users.routes.js';
import jwtPlugin from './plugins/jwt.js';

export function buildApp(logger = false) {
  const app = Fastify({ logger });

  app.register(prismaPlugin);
  app.register(jwtPlugin);
  app.register(healthRoutes, { prefix: '/api/v1' });
  app.register(usersRoutes, { prefix: '/api/v1' });

  return app;
}
