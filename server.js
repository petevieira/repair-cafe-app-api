/**
 * @file server.js
 * Loads the app and starts listening to requests.
 */

// get our ExpressJS app
const app = require('./app');

// start listening for requests
app.listen(8000, () => console.log('Server running on port 8000'));
