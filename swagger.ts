import swaggerAutogen from 'swagger-autogen';

import dotenv from 'dotenv';
dotenv.config();

const doc = {
  info: {
    version: 'v1.0.0',
    title: 'Microservice Posts',
    description: 'Microservice from the "If community" project for managing posts and their categories and interactions (upvotes)'
  },
  host: `localhost:${ Number(process.env.PORT_API ?? '3000') }`,
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'api-key',
      description: 'An API token is a unique access key that grants permission to interact with the API, ensuring security and control over the operations performed.'
    }
  },
};

const outputFile = './swagger-output.json';
const routes = [
    'src/routes/user.routers.ts',
    'src/routes/categories.routers.ts',
    'src/routes/posts.routers.ts',
    'src/routes/vote.controller.ts',
];

swaggerAutogen()(outputFile, routes, doc);