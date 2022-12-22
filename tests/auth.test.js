/**
 * @requires controllers/auth
 */

const request = require('supertest');
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');

const app = require('../src/app');
const authCtrl = require('../src/controllers/auth');
const db = require('./database/test-database-config');
// const User = require('../models/user');

beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('Test the signup path', () => {
  const newUser = {
    first: 'john',
    last: 'smith',
    email: 'test@gmail.com',
    password: 'adminpassword'
  };
  test('new user sign-up', async () => {

    const expectedUser = {
      first: newUser.first,
      last: newUser.last,
      email: newUser.email,
      roles: ['user']
    };
    await request(app)
      .post('/signup')
      .send(newUser)
      .then(res => {
        expect(res.statusCode).toBe(StatusCodes.OK);
        const user = res.body.user;
        expect(user.first).toEqual(expectedUser.first);
        expect(user.last).toEqual(expectedUser.last);
        expect(user.email).toEqual(expectedUser.email);
        expect(user.roles).toEqual(expectedUser.roles);
      })
      .catch(err => {
        console.error(err);
      });
  });

  test('existing email sign-up', async () => {
    await request(app)
      .post('/signup')
      .send(newUser);
    const res = await request(app)
      .post('/signup')
      .send(newUser);
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
