import { FastifyPluginAsync } from "fastify";
import { db, users } from "@saas-boilerplate/database";

const routes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async (request, reply) => {
    const fetchUsers = await db.select().from(users);
    reply.send({
      users: fetchUsers,
    });
  });
};
export default routes;
