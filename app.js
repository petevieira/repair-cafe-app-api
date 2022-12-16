/**
 * @file app.js
 * Creates the ExpressJS app, sets up middleware, and assigns routes.
 */

// third-party packages
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// project files
const authRoutes = require('./routes/auth');

// instantiate HTTP request logger middleware
const morgan = require("morgan");

// create our ExpressJS app
const app = express();

// db connection
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err));

// set up middleware
// parse incoming requests with JSON payloads, and set max request body size
app.use(express.json({ limit: "4mb" }));
// allow parsing requests with url-encoded payloads, using qs library
app.use(express.urlencoded({ extended: true }));
// enable setting up of Cross-origin Resource Sharing rules
app.use(cors());
// use HTTP request logger
app.use(morgan("dev"));

// use authentication routes for /api/* routes
app.use("/api", authRoutes);

// export the app
module.exports = app;
