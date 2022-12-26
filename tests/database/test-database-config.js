/**
 * @file test-database-config.js.
 * @namespace tests
 * @requires mongoose
 * @requires mongodb-memory-server
 * Connects to a MongoDB instance that is stored in memory, specifically used
 *   for testing purposes.
 * Before any tests are run, connect once to the test server with connect().
 * Before each test, clear the database with clear().
 * After all tests have been run, close the connection with close().
 * Referenced: https://dev.to/ryuuto829/setup-in-memory-database-for-testing-node-js-and-mongoose-1kop
 */

// to connect to database
const mongoose = require('mongoose');

// MongoDB server that stores database in memory
const { MongoMemoryServer } = require("mongodb-memory-server");

// connection options
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// use strict queries for Mongoose
mongoose.set('strictQuery', true);

// test server object
let mongoServer = null;

/**
 * connects to database
 */
async function connect() {
  // create memory server instance
  console.debug("Creating MongoMemoryServer...");
  mongoServer = await MongoMemoryServer.create();

  // get the URI of the memory server
  const mongoUri = await mongoServer.getUri();

  // connect to the test database
  console.debug("Connecting MongoMemoryServer using Mongoose...");
  await mongoose.connect(mongoUri, connectionOptions);
}

/**
 * closes and stops the MongoDB connection.
 */
async function close() {
  console.debug("Dropping MongoDB database...");
  await mongoose.disconnect();
  console.debug("Closing MongoDB connection...");
  // await mongoose.connection.close();
  console.debug("Stopping MongoMemoryServer...");
  await mongoServer.stop();
}
/**
 * drops all collections that were used
 *
 * @returns {Object} database object
 */
async function clear() {
  console.debug("Deleting MongoDB collections");
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
}

module.exports = { connect, close, clear };
