import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const userCore = {
  firstname: z.string().min(2).max(20),
  lastname: z.string().min(2).max(20),
  email: z.string().email(),
};

const registerSchema = z.object({
  ...userCore,
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

const loginSchema = z.object({
  email: userCore.email,
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// this is needed for loading the schemas in the fastify app
export const { schemas, $ref } = buildJsonSchemas(
  {
    registerSchema,
    loginSchema,
  },
  { $id: "auth" }
);
