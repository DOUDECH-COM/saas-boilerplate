// import { users } from "@saas-boilerplate/database"
// Require library to exit fastify process, gracefully (if possible)
import { FastifyInstance, FastifyServerOptions, fastify } from "fastify";

type Fastify = typeof fastify;

async function createServerApp(fastify: Fastify, opts: FastifyServerOptions) {
  const app: FastifyInstance = fastify(opts);

  app.register(import("./app.js")).ready((err) => {
    if (err) throw err;
    app.log.info("App ready");
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
  //   ajv: {
  //     customOptions: {
  //       allowUnionTypes: true,
  //       strict: false,
  //     },
  //     // plugins: [ajvFormat, ajvFilePlugin],
  //   },
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
