/**
 * @file app.js
 * @module app
 * @description Creates the ExpressJS app, sets up middleware,
 * and assigns routes.
 */

// Third-party packages
require('dotenv').config();
const process = require('process');
const express = require('express');
const cors = require('cors');
let morgan;
let swaggerUi;
let swaggerSpec;
if (process.env.NODE_ENV !== 'production') {
    morgan = require("morgan"); // instantiate HTTP request logger middleware
    swaggerJSDoc = require('swagger-jsdoc');
    swaggerUi = require('swagger-ui-express');
    swaggerSpec = require('./swagger-jsdoc'); // swagger jsdoc
}
const rootRoutes = require('./routes/root-routes');
const repairsRoutes = require('./routes/repairs-routes');
const repairEventsRoutes = require('./routes/repair-events-routes');
const subscribersRoutes = require('./routes/subscribers-routes');
const textsRoutes = require('./routes/texts-routes');
const volunteersRoutes = require('./routes/volunteers-routes');
const usersRoutes = require('./routes/users-routes'); // users routes

// Create our ExpressJS app
const app = express();

// Set up middleware.
// Parse incoming requests with JSON payloads, and set max request body size
app.use(express.json({ limit: '4mb' }));

// Allow parsing requests with url-encoded payloads, using qs library
app.use(express.urlencoded({ extended: true }));

// Enable setting up of Cross-origin Resource Sharing rules
app.use(cors());

if (process.env.NODE_ENV !== 'production') {
  // Use HTTP request logger
  app.use(morgan('dev'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Use authentication routes for /api/* routes
app.use('/api', rootRoutes);
app.use('/api/repairs', repairsRoutes);
app.use('/api/repair-events', repairEventsRoutes);
app.use('/api/subscribers', subscribersRoutes);
app.use('/api/text', textsRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/users', usersRoutes);

// Export the app
module.exports = app;
