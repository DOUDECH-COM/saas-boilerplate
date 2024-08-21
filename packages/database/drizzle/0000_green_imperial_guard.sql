CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstname" varchar(125),
	"lastname" varchar(125),
	"email" varchar(255),
	"password" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
