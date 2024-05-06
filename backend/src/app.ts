import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { initORM } from './db';
import { Client } from './entities/client'; // Import your entities here

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {}

const options: AppOptions = {} // Pass --options via CLI arguments in command to enable these options.


const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  // Custom code can be placed here

// Define the 'ready' event listener with an async function

  // Initialize ORM with the 'Client' entity
  await initORM({
  entities: [Client]
  });


// Emit the 'ready' event to trigger the listener

  fastify.register(fastifyCors, {
    origin: true, // Reflect the request origin as the allowed CORS origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allow these HTTP methods
  });

  const swaggerOptions = {
    swagger: {
      info: {
            title: "Company-Crawler 🔎 APIs",
            description: "Search through your favorite company, add new company and update them too",
            version: "1.0.0",
        },
        host: "localhost:3000", // Added port 3000 here
        schemes: ["http", "https"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [{ name: "Default", description: "Default" }],
    },
  };

  const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
  };

  // Register Swagger and Swagger UI
  fastify.register(fastifySwagger, swaggerOptions);
  fastify.register(fastifySwaggerUi, swaggerUiOptions);

  // Load plugins and routes
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  });
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  });

};

export default app;
export { app, options }
