import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstname: varchar("firstname", { length: 125 }),
  lastname: varchar("lastname", { length: 125 }),
  email: varchar("email", { length: 255 }).unique(),
  password: text("password"),
});
