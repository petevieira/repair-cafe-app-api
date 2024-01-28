/**
 * @file app.js
 * @module app
 * @description creates the ExpressJS app, sets up middleware,
 *   and assigns routes.
 */

// third-party packages
require('dotenv').config();
const process = require('process');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// let morgan;
// let swaggerJSDoc;
// let swaggerUi;
// let swaggerSpec;
// if (process.env.NODE_ENV !== 'production') {
const morgan = require("morgan"); // instantiate HTTP request logger middleware
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger-jsdoc'); // swagger jsdoc
// }
const database = require('./database/database-config'); // database connection
const rootRoutes = require('./routes/root-routes');
const usersRoutes = require('./routes/users-routes'); // users routes
const itemsRoutes = require('./routes/items-routes');
const volunteersRoutes = require('./routes/volunteers-routes');

// create our ExpressJS app
const app = express();

// set up middleware
// parse incoming requests with JSON payloads, and set max request body size
app.use(express.json({ limit: '4mb' }));

// allow parsing requests with url-encoded payloads, using qs library
app.use(express.urlencoded({ extended: true }));

// enable setting up of Cross-origin Resource Sharing rules
app.use(cors());

// if (process.env.NODE_ENV !== 'production') {
  // use HTTP request logger
  app.use(morgan('dev'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// }

// use authentication routes for /api/* routes
app.use('/api', rootRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/items', itemsRoutes);

// export the app
module.exports = app;
