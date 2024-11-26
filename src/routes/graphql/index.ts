import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit'
import { schema } from './schema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const validationErrors = validate(schema, parse(req.body.query), [depthLimit(5)]);
      return validationErrors.length
        ? { errors: validationErrors }
        : graphql({
          schema,
          source: req.body.query,
          variableValues: req.body.variables,
          contextValue: { prisma },
        });
    },
  });
};

export default plugin;
