import { FastifyPluginAsync } from "fastify";
import { db, users, eq } from "@saas-boilerplate/database";
import {
  $ref,
  AuthHeaders,
  LoginInput,
  RegisterInput,
} from "src/schemas/auth.schema";
import * as _ from "radash";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const routes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post(
    "/signup",
    {
      schema: {
        body: $ref("registerSchema"),
      },
    },
    async (request, reply) => {
      const { email, password, firstname, lastname } =
        request.body as RegisterInput;
      try {
        const exists = await db
          .select()
          .from(users)
          .where(eq(users.email, email));
        if (exists.length > 0) {
          return reply.status(409).send({
            message: "User already exists",
          });
        }
        const hash = await argon2.hash(password);
        await db.insert(users).values({
          email,
          firstname,
          lastname,
          password: hash,
        });
        return reply.send({
          message: "Successfully registered your account",
        });
      } catch (error: any) {
        throw new Error("Internal Server Error");
      }
    }
  );
  fastify.post(
    "/signin",
    {
      schema: {
        body: $ref("loginSchema"),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as LoginInput;

      try {
        const user = (
          await db.select().from(users).where(eq(users.email, email))
        )[0];
        if (!user)
          return reply.status(404).send({
            message: "User not found",
          });

        if (await argon2.verify(user.password!, password)) {
          const tokenPayload = {
            id: user.id,
            email: user.email,
          };
          const accessToken = jwt.sign(
            tokenPayload,
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: process.env.ACCESS_TOKEN_TTL! }
          );
          return reply.send({
            message: "Successfully generated access token for authentication",
            token: accessToken,
            user: _.omit(user, ["password"]),
          });
        } else {
          return reply.code(401).send({
            message: "Invalid password",
          });
        }
      } catch (error: any) {
        throw new Error("Internal Server Error");
      }
    }
  );

  fastify.get(
    "/verify",
    {
      preHandler: [fastify.verifyToken],
    },
    async (request, reply) => {
      const user = request.loggedUser;
      if (!user) {
        return reply.code(401).send({
          message: "There was a problem verifying the user",
        });
      }
      reply.send({
        fullname: user.firstname + " " + user.lastname,
      });
    }
  );
};
export default routes;
