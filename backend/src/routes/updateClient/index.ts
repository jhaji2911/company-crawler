import { FastifyPluginAsync } from 'fastify';
import { initORM } from '../../db';
import { Client } from '../../entities';
import { validate } from 'class-validator';

const updateClient: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.put(
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
        },
        body: {
          type: 'object',
          properties: {
            CIN: { type: 'string' },
            companyName: { type: 'string' },
            address: { type: 'string' },
            pinCode: { type: 'string' },
            email: { type: 'string' }
          }
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { CIN, companyName, address, pinCode, email } = request.body as {
        CIN?: string;
        companyName?: string;
        address?: string;
        pinCode?: string;
        email?: string;
      };

      try {
        const db = (await initORM()).em.fork();
        const client = await db.findOne(Client, { id });

        if (!client) {
          return reply.status(404).send({
            success: false,
            error: true,
            message: 'Client not found'
          });
        }

        // Update client instance with new values
        client.CIN = CIN ?? client.CIN;
        client.companyName = companyName ?? client.companyName;
        client.address = address ?? client.address;
        client.pinCode = pinCode ?? client.pinCode;
        client.email = email ?? client.email;

        // Validate updated client instance using class-validator
        const errors = await validate(client);
        if (errors.length > 0) {
          return reply.status(400).send({
            success: false,
            error: true,
            message: 'Validation failed',
            errors: errors.map(error => ({
              property: error.property,
              constraints: error.constraints
            }))
          });
        }

        // Persist the updated client to the database
        await db.persist(client).flush();
        reply.send({
          success: true,
          error: false,
          message: 'Client updated successfully',
          data: client
        });
      } catch (error: any) {
        reply.send({
          success: false,
          error: true,
          message: 'Failed to update client'
        });
      }
    }
  );
};

export default updateClient;
