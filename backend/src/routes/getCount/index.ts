import { FastifyPluginAsync } from 'fastify';
import { initORM } from '../../db';
import { Client } from '../../entities';

const getAllClients: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async (request, reply) => {
    try {
      const orm = (await initORM()).em.fork();
      const repo = orm.getRepository(Client);
      const clientsCount = await repo.count();
      reply.send({
        success: true,
        error: false,
        message: 'Clients count fetched successfully',
        data: {
          count: clientsCount
        }
      });
    } catch (error) {
      reply.send({
        success: false,
        error: true,
        message: 'Failed to fetch clients count'
      });
    }
  });
};

export default getAllClients;
