/**
 * @file Database-config.js.
 * @requires dotenv
 * @requires mongoose
 */

// to read config.env file
require('dotenv').config();
// to connect to MongoDB database
const MongoClient = require("mongodb").MongoClient;
// to connect to database
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// test mongo server
let mongoMemoryServer;

// load package that allows database connection with unit testing
if (process.env.NODE_ENVIRONMENT === "test") {
  mongoMemoryServer = require("mongodb-memory-server");
}

// connection string retreived from Mongodb Atlas
const connectionString = process.env.DATABASE_CONNECTION_STRING;
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
const dbName = process.env.DATABASE_NAME;

// create MongoClient
var _db = null;

// connect to database, either for real or to test database
if (process.env.NODE_ENVIRONMENT !== "test") {
  // production connection
  module.exports = {

    /**.
     * Connects to database
     *
     * @param {Function} callback - function to call after finished connecting
     */
    connectToDatabase: () => {
      mongoose.connect(connectionString);
    },
  };
} else {
  // test connection
  module.exports = {
    /**
     * connects to database
     */
    connectToDatabase: async () => {
      let mongoServer = new mongoMemoryServer.MongoMemoryServer.create();
      const mongoUri = await mongoServer.getUri();
      await mongoose.connect(mongoUri, connectionOptions);
    },

    /**
     * closes and stops the MongoDB connection.
     */
    closeAndStop: async () => {
      if (mongo) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
      }
    },
    /**
     * gets the database object
     *
     * @returns {Object} database object
     */
    dropCollection: async () => {
      if (mongo) {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
          await collection.remove();
        }
      }
    }
  };
}
