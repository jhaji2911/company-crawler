import { FastifyPluginAsync } from 'fastify';
import { initORM } from '../../db';
import { Client } from '../../entities';
const deleteClient: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.delete(
    '/:id',
    {
      schema: {
        consumes: ['application/json'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      try {
        const db = (await initORM()).em.fork();
        const client = await db.findOne(Client, { id });

        if (!client) {
          return reply.send({
            success: false,
            error: true,
            message: 'Client not found'
          });
        }

        // Delete client instance from the database
        await db.remove(client).flush();
        reply.send({
          success: true,
          error: false,
          message: 'Client deleted successfully'
        });
      } catch (error: any) {
        reply.send({
          success: false,
          error: true,
          message: 'Failed to delete client'
        });
      }
    }
  );
};

export default deleteClient;
