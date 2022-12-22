/**
 * @file Database-config.js.
 * @requires dotenv
 * @requires mongoose
 * This is the database setup for connecting to the real MongoDB server.
 * Just use the connect() function to start a connection and start interacting
 *   with your database.
 */

// to read config.env file
require('dotenv').config();

// to connect to database
const mongoose = require('mongoose');

// connection options
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// use strict queries for Mongoose
mongoose.set('strictQuery', true);

// connection string retreived from Mongodb Atlas
const connectionString = process.env.DATABASE_CONNECTION_STRING;

/**.
 * Connects to database
 *
 * @param {Function} callback - function to call after finished connecting
 */
async function connect() {
  console.debug("Connecting to real MongoDB cluster...");
  try {
    await mongoose.connect(connectionString);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { connect };

