/**
 * @namespace tests
 * @requires controllers/users
 */

jest.mock('@sendgrid/mail');
const sgMail = require('@sendgrid/mail');
const defaultMailOptions = { response: 'Okay' };

const request = require('supertest'); // for testing REST functions
const { StatusCodes } = require('http-status-codes'); // for HTTP status codes

const app = require('../../src/app');
const db = require('../database/test-database-config');
const User = require('../../src/models/user');

// handle database connection, clearing, and disconnection, and mocks
beforeAll(async () => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  await db.connect()
});
beforeEach(async () => {
  global.mockMailer = (options=defaultMailOptions) => {
    return sgMail.sendMultiple.mockImplementation(() => Promise.resolve(options));
  };
});
afterEach(async () => {
  jest.clearAllMocks();
  await db.clear();
});
afterAll(async () => await db.close());

describe('/users/sign-in', () => {
  // test user for requests
  const testUser = {
    first: 'john',
    last: 'smith',
    email: 'test@gmail.com',
    password: 'adminpassword',
    roles: 'volunter'
  };

  test('should succeed for existing user with correct password', async () => {
    // arrange
    // insert user into db
    const signupUser = await new User(testUser).save();


    // act
    const res = await request(app).post('/users/sign-in').send(testUser);

    // assert
    expect(signupRes.status).toBe(StatusCodes.OK);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.data.token).toBeTruthy();
    const user = res.body.data.user;
    expect(user.first).toEqual(testUser.first);
    expect(user.last).toEqual(testUser.last);
    expect(user.email).toEqual(testUser.email);
    expect(user.roles).toEqual(['user']);
  });

  test('should fail for user with wrong password', async () => {
    // arrange
    // sign user up first
    await request(app).post('/users/sign-up').send(testUser);
    let wrongPwdUser = testUser;
    wrongPwdUser.password = 'wrongpassword';

    // act
    const res = await request(app).post('/users/sign-in').send(wrongPwdUser);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
});

describe('/users/email-is-registered', () => {
  // test user for requests
  const testUser = {
    first: 'john',
    last: 'smith',
    email: 'test@gmail.com',
    password: 'adminpassword'
  };

  test("should succeed if the email isn't registered, but give false data", async () => {
    // arrange

    // act
    const res = await request(app)
      .post('/users/email-is-registered')
      .send({ email: testUser.email });

    // assert
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.data.emailRegistered).toBe(false);
    expect(res.body.data.user).toBeFalsy();
  });

  test("should succeed if the email is registered", async () => {
    // arrange
    const user = new User(testUser).save();

    // act
    const res = await request(app)
      .post('/users/email-is-registered')
      .send({ email: testUser.email });
    const data = res.body.data;

    // assert
    expect(user).toBeTruthy();
    expect(res.status).toBe(StatusCodes.OK);
    expect(data.emailRegistered).toBe(true);
    expect(data.user.email).toEqual(testUser.email);
    expect(data.user.first).toEqual(testUser.first);
    expect(data.user.last).toEqual(testUser.last);
  });
});
