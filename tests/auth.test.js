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
const authCtrl = require('../src/controllers/auth-controller');
const db = require('./database/test-database-config');
// const User = require('../models/user');

beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

const testUser = {
  first: 'john',
  last: 'smith',
  email: 'test@gmail.com',
  password: 'adminpassword'
};

describe('Test the signup path', () => {
  test('new user sign-up', async () => {
    const expectedUser = {
      first: testUser.first,
      last: testUser.last,
      email: testUser.email,
      roles: ['user']
    };
    await request(app)
      .post('/signup')
      .send(testUser)
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
      .send(testUser);
    const res = await request(app)
      .post('/signup')
      .send(testUser);
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
});

describe('Test the signin path', () => {
  test('existing user sign-in', async () => {
    // sign user up first
    await request(app).post('/signup').send(testUser);

    await request(app)
      .post('/signin')
      .send(testUser)
      .then(res => {
        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body.token).toBeTruthy();
        const user = res.body.user;
        expect(user.first).toEqual(testUser.first);
        expect(user.last).toEqual(testUser.last);
        expect(user.email).toEqual(testUser.email);
        expect(user.roles).toEqual(['user']);
      })
      .catch(err => {
        console.error(err);
      });
  });
});
