/**
 * @file server.js
 * @module server
 * @description loads the app and starts listening to requests.
 */

const process = require('process'); // for uncaught exceptions

const app = require('./app'); // get our ExpressJS app
const database = require('./database/database-config'); // database connection

// Catch uncaught exceptions and exit app
process.on("uncaughtException", err => {
  console.error("UNCAUGHT EXCEPTION!!! shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// read in key and certification for secure HTTP using Open SSL
// var key = fs.readFileSync(__dirname + "/../ssl-certs/selfsigned.key");
// var cert = fs.readFileSync(__dirname + "/../ssl-certs/selfsigned.crt");
const sslOptions = {
//   key: key,
//   cert: cert
};

// Connect to database
database.connect();

// Create server with secure https
// https.createServer(sslOptions, app);
// Start listening for requests
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
console.log('App is running in ' + process.env.NODE_ENV
    + ' mode and listening on port ' + port);
});

function handleSignal(signal) {
  console.info(`Received ${signal}`);
  console.log('Closing server...');
  server.close(async () => {
    console.log('Server closed');
  });
}

// Handle Interrupt and Terminate signals on command-line
process.on('SIGINT', handleSignal);
process.on('SIGTERM', handleSignal);
