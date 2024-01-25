// lambda.js
require('source-map-support/register')
const serverlessExpress = require('@codegenie/serverless-express')
const app = require('./src/app')
const database = require('./src/database/database-config'); // database connection
const process = require('process');

let serverlessExpressInstance

function asyncTask () {
  return new Promise(async (resolve) => {
    // connect to database
    let db = await database.connect();

    // create server with secure https
    // https.createServer(sslOptions, app);

    // start listening for requests
    const port = process.env.DB_LISTEN_PORT || 3000;
    const server = app.listen(port, () => {
      resolve('App is running in ' + process.env.NODE_ENV
        + ' mode and listening on port ' + port);
    });
  })
}

async function setup (event, context) {
  const asyncValue = await asyncTask()
  console.log(asyncValue)
  serverlessExpressInstance = serverlessExpress({ app })
  return serverlessExpressInstance(event, context)
}

function handler (event, context) {
  if (serverlessExpressInstance) return serverlessExpressInstance(event, context)

  return setup(event, context)
}

exports.handler = handler