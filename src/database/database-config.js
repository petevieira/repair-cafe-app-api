/**
 * @file Database-config.js.
 * @requires dotenv
 * @requires mongoose
 * This is the database setup for connecting to the real MongoDB server.
 * Just use the connect() function to start a connection and start interacting
 * with your database.
 */

// To read config.env file
require('dotenv').config();

// To connect to database
const mongoose = require('mongoose');

// Connection options
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Use strict queries for Mongoose
mongoose.set('strictQuery', true);

// Connection string retreived from Mongodb Atlas
let connectionString = '';
if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.DATABASE_CONNECTION_STRING;
} else {
  connectionString = process.env.DEV_DATABASE_CONNECTION_STRING;
}

/**
 * Connects to database
 */
async function connect() {
  console.log(
    `Connecting in ${process.env.NODE_ENV} mode to real MongoDB cluster...`
  );
  try {
    await mongoose.connect(connectionString);
  } catch (err) {
    console.error(err);
  }
}

async function close() {
  try {
    await mongoose.connection.close(false);
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error(err);
  }
}

module.exports = { connect, close };

