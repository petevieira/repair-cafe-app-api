# Server
- NodeJS server using
  - **ExpressJS** for routing
  - **Mongoose** for MongoDB database schemas/modeling
  - **JSDoc** for code documentation
- The initial authentication code for this project was created using the
tool at https://www.npmjs.com/package/kaloraat

## Setup
1. Install third-party packages
  1. `npm install`
1. Start the local server
  1. `npm start`
1. Go to http://localhost:8000/api to test the home endpoint.
You should get a simple message in JSON.

## Documentation
JSDoc is used to generate code documentation.

### Create the Documentation
1. From the server root directory run
  1. `npm run gendocs`
