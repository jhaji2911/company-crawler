import { FastifyPluginAsync } from 'fastify';
import { initORM } from '../../db';
import { Client } from '../../entities';
import { validate } from 'class-validator';

const addClient: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        consumes: ['application/json'],
        body: {
          type: 'object',
          required: ['CIN', 'companyName', 'address', 'pinCode', 'email'],
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
      const { CIN, companyName, address, pinCode, email } = request.body as {
        CIN: string;
        companyName: string;
        address: string;
        pinCode: string;
        email: string;
      };

      // Create a new client instance
      const newClient = new Client({
        CIN,
        companyName,
        address,
        pinCode,
        email
      });

      // Validate client instance using class-validator
      const errors = await validate(newClient);
      if (errors.length > 0) {
        return reply.send({
          success: false,
          error: true,
          message: 'Validation failed',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
      }

      try {
        const db = (await initORM()).em.fork();

        // Persist the new client to the database
        await db.persist(newClient).flush();
        reply.send({
          success: true,
          error: false,
          message: 'Client added successfully',
          data: newClient
        });
      } catch (error: any) {
        // 23505 is a postgres error code indicating that a unique constraint was violated
        if (error?.code === '23505') {
          reply.send({
            success: false,
            error: true,
            message: 'Client with the provided CIN already exists'
          });
        } else {
          reply.send({
            success: false,
            error: true,
            message: 'Failed to add client'
          });
        }
      }
    }
  );
};

export default addClient;
