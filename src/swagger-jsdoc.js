/**
 *
 */

const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for Repair Cafe',
    version: '1.0.0',
    description: 'This is a REST API application made with ExpressJS. ' +
      'It handles CRUD operations with a MongoDB database use for a ' +
      'repair cafe app',
    license: {
      name: '',
      url: ''
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      }
    ]
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
