import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./database.js";

migrate(db, { migrationsFolder: "./drizzle" })
  .then(() => {
    console.log("migrations finished!");
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
