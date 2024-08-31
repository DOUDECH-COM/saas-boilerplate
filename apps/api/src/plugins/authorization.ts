import { db, users, InferSelectModel, sql } from "@saas-boilerplate/database";
import { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
import * as _ from "radash";

/**
 * Authorization plugin that handle every step in authorization process.
 */
async function authorization(fastify: FastifyInstance) {
  const { httpErrors } = fastify;

  async function verifyToken(request: FastifyRequest) {
    const headerValue = request.headers["authorization"] || "";

    const matches = headerValue.match(/bearer\s+(\S+)/i);

    const token = matches ? matches[1] : null;

    if (!token) {
      throw httpErrors.unauthorized(
        "Authorization header is missing or invalid"
      );
    }
    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as any;
      const user = (
        await db
          .select()
          .from(users)
          .where(sql`${users.id} = ${decoded.id}`)
      )[0];
      if (!user) {
        throw httpErrors.unauthorized("User not found");
      }
      request.loggedUser = _.omit(user, ["password"]);
    } catch (err) {
      throw err;
    }
  }

  fastify.decorate<any>("verifyToken", verifyToken);
  fastify.decorateRequest<InferSelectModel<typeof users> | null>(
    "loggedUser",
    null
  );
}

export default fp(authorization, {
  name: "authorization",
  dependencies: ["sensible"],
});
