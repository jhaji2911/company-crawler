import { FastifyPluginAsync } from 'fastify';
import { initORM } from '../../db';
import { Client } from '../../entities';
const searchClient: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get(
    '/',
    {
      schema: {
        consumes: ['application/json'],
        querystring: {
          type: 'object',
          properties: {
            companyName: { type: 'string' },
            CIN: { type: 'string' },
            email: { type: 'string' }
          },
          required: []
        }
      }
    },
    async (request, reply) => {
      const { companyName, CIN, email } = request.query as {
        companyName?: string;
        CIN?: string;
        email?: string;
      };
      try {
        const db = (await initORM()).em.fork();

        // creating search criteria based on provided query parameters
        const searchCriteria: any = {};
        if (companyName) {
          searchCriteria.$or = [
            { companyName: new RegExp('^' + companyName + '$', 'i') }, // full text match
            { companyName: new RegExp('^' + companyName, 'i') }, // startsWith
            { companyName: new RegExp(companyName + '$', 'i') } // endWith
          ];
        }
        if (CIN) searchCriteria.CIN = CIN;
        if (email) searchCriteria.email = email;
        const clients = await db.find(Client, searchCriteria);

        if (clients.length === 0) {
          return reply.status(404).send({
            success: false,
            error: true,
            message: 'No clients found'
          });
        }

        reply.send({
          success: true,
          error: false,
          message: 'Clients found',
          data: clients
        });
      } catch (error: any) {
        console.log(`Error in searching clients: ${error}`);
        reply.send({
          success: false,
          error: true,
          message: 'Failed to search clients'
        });
      }
    }
  );
};

export default searchClient;
