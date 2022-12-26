/**
 * @file app.js
 * @module app
 * @description creates the ExpressJS app, sets up middleware,
 *   and assigns routes.
 */

// third-party packages
require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require("morgan"); // instantiate HTTP request logger middleware
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const database = require('./database/database-config'); // database connection
const usersRoutes = require('./routes/users-routes'); // users routes
const eventsRoutes = require('./routes/events-routes'); // events routes
const swaggerSpec = require('./swagger-jsdoc'); // swagger jsdoc

// create our ExpressJS app
const app = express();

// set up middleware
// parse incoming requests with JSON payloads, and set max request body size
app.use(express.json({ limit: '4mb' }));
// allow parsing requests with url-encoded payloads, using qs library
app.use(express.urlencoded({ extended: true }));
// enable setting up of Cross-origin Resource Sharing rules
// app.use(cors());
// use HTTP request logger
app.use(morgan('dev'));

// use authentication routes for /api/* routes
app.use('/users', usersRoutes);
app.use('/events', eventsRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// export the app
module.exports = app;
