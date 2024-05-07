import { FastifyPluginAsync } from 'fastify';
import { initORM } from '../../db';
import { Client } from '../../entities';

const getAllClients: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async (request, reply) => {
    try {
      const orm = (await initORM()).em.fork();
      const repo = orm.getRepository(Client);
      const clients = await repo.findAll({
        fields: ['companyName', 'CIN', 'email']
      });

      reply.send({
        success: true,
        error: false,
        message: 'Clients fetched successfully',
        data: clients
      });
    } catch (error) {
      reply.send({
        success: false,
        error: true,
        message: 'Failed to fetch clients'
      });
    }
  });
};

export default getAllClients;
