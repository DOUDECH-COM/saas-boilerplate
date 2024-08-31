// Require library to exit fastify process, gracefully (if possible)
import { FastifyInstance, FastifyServerOptions, fastify } from "fastify";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  db,
  initDb,
  users,
  InferSelectModel,
} from "@saas-boilerplate/database";
await initDb(); // initialize the database

type Fastify = typeof fastify;

// safeUsers is just the type of users but the password field is omitted
interface safeUsers extends Omit<InferSelectModel<typeof users>, "password"> {}

declare module "fastify" {
  interface FastifyInstance {
    verifyToken: () => Promise<void>;
  }
  interface FastifyRequest {
    loggedUser: safeUsers | null;
  }
}

async function createServerApp(fastify: Fastify, opts: FastifyServerOptions) {
  const app: FastifyInstance = fastify(opts);

  app.register(import("./app.js")).ready((err) => {
    if (err) throw err;
    app.log.info("App ready");
  });

  // this for add schemas to the app
  // WARNING: DO NOT TOUCH THE LINES BELOW
  const schemasPath = path.join(__dirname, "schemas");
  const schemas = fs.readdirSync(schemasPath);
  schemas.forEach(async (schema) => {
    if (schema.endsWith(".schema.ts")) {
      const schemaExports = await import(path.join(schemasPath, schema));
      app.addSchema(schemaExports.schemas[0]);
    }
  });

  return app;
}
//@ts-ignore
const app = await createServerApp(fastify, {
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  pluginTimeout: 20000,
});
//server listen

const port = process.env["SERVER_PORT"] || 8000;
const host = process.env["SERVER_HOST"] || "localhost";
app.listen({ host: host, port: parseInt(port as string) }, (err: any) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
