import { buildApp } from './app.js';
import { config } from './config.js';

const { port, host } = config;

const app = buildApp(true);

try {
  await app.listen({ port, host });
  app.log.info(`Server is running on ${host}:${port}`);
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
