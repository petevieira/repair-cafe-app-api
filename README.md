# Server
- NodeJS server for repair cafe apps, using
  - **ExpressJS** for routing
  - **Mongoose** for MongoDB database schemas/modeling
  - **JSDoc** for generating code documentation
  - **MongoMemoryServer** for testing the functions that interact with the database
  - **JsonWebTokens** for creating sign tokens for security
  - **SendGrid** for sending emails from the server and creating email templates (on SendGrid's website)
- The initial authentication code for this project was created using the
tool at https://www.npmjs.com/package/kaloraat

## Setup
1. Install third-party packages
    - `npm install`
1. `.env` in the root of the server is used to set environment variables. Use the env.default starter file to make a valid .env file
1. Start the local server
    - `npm run start`
1. Go to http://localhost:3000 to test the home endpoint.
    - You should get a simple message in JSON.

## Documentation
JSDoc is used to generate code documentation.

### Create the Documentation
1. From the server root directory run
  1. `npm run jsdoc`

## Testing
Unit tests are written using the Jest JavaScript testing framework.
### Run the tests
- `npm run test`

## Coding Standards
1. Use 2-space indents
1. Opening braces go on same line as block
1. 80 character line limit
1. Functions should ideally be less than 40 lines
1. All functions and data types must be commented using JSDoc format, including at least description, parameters, returns
