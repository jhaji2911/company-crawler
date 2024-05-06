import { FastifyPluginAsync } from "fastify";
import { initORM } from "../../db";
import { Client } from "../../entities";

const getClient: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get(
    "/:id",
    {
      schema: {
        consumes: ["application/json"],
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id?: string };
      
      if (!id) {
        return reply.status(400).send({
          success: false,
          error: true,
          message: "clientId is required",
        });
      }

      try {
        const orm = (await initORM()).em.fork();
        const repo = orm.getRepository(Client);
        const client: Client = await repo.findOneOrFail({
          id,
        });

        reply.send({
          success: true,
          error: false,
          message: "Client fetched successfully",
          data: client,
        });
      } catch (error) {
        console.log(`Error in getting client ${error}`);
        reply.send({
          success: false,
          error: true,
          message: "Failed to fetch client",
        });
      }
    }
  );
};

export default getClient;
