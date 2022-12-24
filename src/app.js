/**
 * @file app.js
 * Creates the ExpressJS app, sets up middleware, and assigns routes.
 */

// third-party packages
require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const mongoose = require('mongoose');
const database = require('./database/database-config'); // database connection

// project files
const usersRoutes = require('./routes/users-routes');
const eventsRoutes = require('./routes/events-routes');

// instantiate HTTP request logger middleware
const morgan = require("morgan");

// create our ExpressJS app
const app = express();

// set up middleware
// parse incoming requests with JSON payloads, and set max request body size
app.use(express.json({ limit: "4mb" }));
// allow parsing requests with url-encoded payloads, using qs library
app.use(express.urlencoded({ extended: true }));
// enable setting up of Cross-origin Resource Sharing rules
// app.use(cors());
// use HTTP request logger
app.use(morgan("dev"));

// use authentication routes for /api/* routes
app.use("/users", usersRoutes);
app.use("/events", eventsRoutes);

// export the app
module.exports = app;
