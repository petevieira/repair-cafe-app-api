/**
 * @file Database-config.js.
 * @requires dotenv
 * @requires mongoose
 */

// to read config.env file
require('dotenv').config();
// to connect to MongoDB database

// to connect to database
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const MongoClient = require("mongodb");

let connection = MongoClient;
// test mongo server
let MongoMemoryServer = require("mongodb-memory-server");
let mongoServer;

// load package that allows database connection with unit testing
if (process.env.NODE_ENVIRONMENT === "test") {
  // MongoMemoryServer = require("mongodb-memory-server");
}

// connection string retreived from Mongodb Atlas
const connectionString = process.env.DATABASE_CONNECTION_STRING;
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// connect to database, either for real or to test database
if (process.env.NODE_ENVIRONMENT !== "test") {
  // production connection

  /**.
   * Connects to database
   *
   * @param {Function} callback - function to call after finished connecting
   */
  async function connect() {
    console.debug("Connecting to real MongoDB cluster");
    try {
      await mongoose.connect(connectionString);
    } catch (err) {
      console.error(err);
    }
  }

  module.exports = { connect };
} else {
  // test connection

  /**
   * connects to database
   */
  async function connect() {
    if (!!mongoServer) {
      console.debug("Previous MongoMemoryServer active. Stopping it...");
      mongoServer.stop();
    }
    console.debug("Starting MongoMemoryServer server");
    mongoServer = await MongoMemoryServer.MongoMemoryServer.create()
    if (!!mongoose.connection) {
      console.debug("Previous MongoDB connection active. Closing it...");
      await closeAndStop();
      await dropCollections();
    }
    console.debug("Starting new MongoDB connection");
    await mongoose.connect(mongoServer.getUri());
  }

  /**
   * closes and stops the MongoDB connection.
   */
  async function closeAndStop() {
    console.debug("Dropping MongoDB database");
    await mongoose.connection.dropDatabase();
    console.debug("Closing MongoDB connection");
    await mongoose.connection.close();
    console.debug("Stopping MongoMemoryServer");
    await mongoServer.close();
  }
  /**
   * drops all collections that were used
   *
   * @returns {Object} database object
   */
  async function dropCollections() {
    console.debug("Deleting MongoDB collections");
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  }

  module.exports = { connect, closeAndStop, dropCollections };
}
