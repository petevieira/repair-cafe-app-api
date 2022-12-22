/**
 * @file server.js
 * Loads the app and starts listening to requests.
 */

const fs = require('fs'); // for file system interaction
const https = require('https'); // for secure HTTPS
const process = require('process'); // for uncaught exceptions

const app = require('./app'); // get our ExpressJS app
const database = require('./database/database-config'); // database connection

/* Catch uncaught exceptions and exit app */
process.on("uncaughtException", err => {
  console.error("UNCAUGHT EXCEPTION!!! shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// read in key and certification for secure HTTP using Open SSL
var key = fs.readFileSync(__dirname + "/../ssl-certs/selfsigned.key");
var cert = fs.readFileSync(__dirname + "/../ssl-certs/selfsigned.crt");
const sslOptions = {
  key: key,
  cert: cert
};

// connect to database
let db = database.connectToDatabase();

// create server with secure https
https.createServer(sslOptions, app);

// start listening for requests
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App is running in ' + process.env.NODE_ENVIRONMENT
    + ' mode and listening on port ' + port);
});
