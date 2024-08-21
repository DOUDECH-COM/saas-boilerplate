export * from "./schema.js";
import * as schema from "./schema.js";
// import { env, Logger } from "@api/utils";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
const { Pool } = pg;

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// eslint-disable-next-line import/no-mutable-exports
export let db: ReturnType<typeof drizzle<typeof schema>>;
// console.log("database URL:", process.env.DATABASE_URL);
export const initDb = async () => {
  const pool = await new Pool({
    connectionString: process.env.DATABASE_URL,
  })
    .connect()
    .then((client) => {
      //   Logger.info("INIT", "Connected to database");

      return client;
    })
    .catch((error) => {
      //   Logger.error("INIT", `Failed to connect to database ${String(error)}}`);
      throw new Error(`Failed to connect to database ${String(error)}`);
    });

  db = drizzle(pool, {
    schema,
  });

  await migrate(db, { migrationsFolder: path.join(__dirname, "drizzle") })
    .then(() => {
      //   Logger.info("INIT", "Migrated database");
    })
    .catch((error) => {
      //   Logger.error("INIT", `Failed to migrate database ${String(error)}`);
      throw new Error(`Failed to migrate database ${String(error)}`);
    });
};
