/**
 * @requires controllers/users
 */

jest.mock('@sendgrid/mail');
const sgMail = require('@sendgrid/mail');
const defaultMailOptions = { response: 'Okay' };

const request = require('supertest'); // for testing CRUD functions
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

describe('/users/signup', () => {
  // test user for requests
  const testUser = {
    first: 'john',
    last: 'smith',
    email: 'test@gmail.com',
    password: 'adminpassword',
    resetCode: '12345'
  };

  test('should succeed for new user with all fields', async () => {
    // arrange
    const expectedUser = {
      first: testUser.first,
      last: testUser.last,
      email: testUser.email,
      roles: ['user']
    };

    // act
    const res = await request(app).post('/users/signup').send(testUser);

    // assert
    expect(res.status).toBe(StatusCodes.OK);
    const user = res.body.user;
    expect(user.first).toEqual(expectedUser.first);
    expect(user.last).toEqual(expectedUser.last);
    expect(user.email).toEqual(expectedUser.email);
    expect(user.roles).toEqual(expectedUser.roles);
  });

  test('should fail for user with email already in database', async () => {
    // arrange
    await request(app).post('/users/signup').send(testUser);

    // act
    const res = await request(app).post('/users/signup').send(testUser);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should fail if first missing from request', async () => {
    // arrange
    delete testUser.first;

    // act
    const res = await request(app).post('/users/signup').send(testUser);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should fail if last missing from request', async () => {
    // arrange
    delete testUser.last;
    console.log(testUser);

    // act
    const res = await request(app).post('/users/signup').send(testUser);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should fail if email missing from request', async () => {
    // arrange
    delete testUser.email;
    console.log(testUser);

    // act
    const res = await request(app).post('/users/signup').send(testUser);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should fail if password missing from request', async () => {
    // arrange
    delete testUser.password;
    console.log(testUser);

    // act
    const res = await request(app).post('/users/signup').send(testUser);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
});

describe('/users/signin', () => {
  // test user for requests
  const testUser = {
    first: 'john',
    last: 'smith',
    email: 'test@gmail.com',
    password: 'adminpassword',
    resetCode: '12345'
  };

  test('should succeed for existing user with correct password', async () => {
    // arrange
    // sign user up first
    const signupRes = await request(app).post('/users/signup').send(testUser);

    // act
    const res = await request(app).post('/users/signin').send(testUser);

    // assert
    console.log("signupRes res: ", signupRes.status);
    expect(signupRes.status).toBe(StatusCodes.OK);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.token).toBeTruthy();
    const user = res.body.user;
    expect(user.first).toEqual(testUser.first);
    expect(user.last).toEqual(testUser.last);
    expect(user.email).toEqual(testUser.email);
    expect(user.roles).toEqual(['user']);
  });

  test('should fail for user with wrong password', async () => {
    // arrange
    // sign user up first
    await request(app).post('/users/signup').send(testUser);
    let wrongPwdUser = testUser;
    wrongPwdUser.password = 'wrongpassword';

    // act
    const res = await request(app).post('/users/signin').send(wrongPwdUser);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
});

describe('/users/forgot-password', () => {
  // test user for requests
  const testUser = {
    first: 'john',
    last: 'smith',
    email: 'test@gmail.com',
    password: 'adminpassword',
    resetCode: '12345'
  };

  test('should fail if email is not provided', async () => {
    // arrange
    const requestData = {};

    // act
    const res = await request(app).post('/users/forgot-password').send(requestData);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should fail if email cannot be found', async () => {
    // arrange
    await request(app).post('/users/signup').send(testUser);
    const requestData = { email: 'wrongemail@gmail.com' };

    // act
    const res = await request(app).post('/users/forgot-password').send(requestData);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should succeed if valid email provided', async () => {
    // arrange
    await request(app).post('/users/signup').send(testUser);
    const requestData = { email: testUser.email };

    // act
    const res = await request(app).post('/users/forgot-password').send(requestData);

    // assert
    expect(res.status).toBe(StatusCodes.OK);
  });
});

describe('/users/reset-password', () => {
  // test user for requests
  const testUser = {
    first: 'john',
    last: 'smith',
    email: 'test@gmail.com',
    password: 'adminpassword',
    resetCode: '12345'
  };

  test('should fail if resetCode is not provided', async () => {
    // arrange
    await request(app).post('/users/signup').send(testUser);
    const requestData = { email: testUser.email, newPassword: 'asdfasdf' };

    // act
    const res = await request(app).post('/users/reset-password').send(requestData);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should fail if email is not provided', async () => {
    // arrange
    await request(app).post('/users/signup').send(testUser);
    const requestData = {
      resetCode: testUser.resetCode,
      newPassword: 'asdfasdf'
    };

    // act
    const res = await request(app).post('/users/reset-password').send(requestData);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should fail if newPassword is not provided', async () => {
    // arrange
    await request(app).post('/users/signup').send(testUser);
    const requestData = {
      email: testUser.email,
      resetCode: testUser.resetCode,
    };

    // act
    const res = await request(app).post('/users/reset-password').send(requestData);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should fail if email is incorrect not found in any users', async () => {
    // arrange
    await request(app).post('/users/signup').send(testUser);
    const requestData = {
      email: 'wrongemail@gmail.com',
      resetCode: testUser.resetCode,
      newPassword: 'newpasswd'
    };

    // act
    const res = await request(app).post('/users/reset-password').send(requestData);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should fail if resetCode not found in any users', async () => {
    // arrange
    await request(app).post('/users/signup').send(testUser);
    const requestData = { email: testUser.email, resetCode: 'wrongCode' };

    // act
    const res = await request(app).post('/users/reset-password').send(requestData);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should fail if new password does not meet requirements', async () => {
    // arrange
    await request(app).post('/users/signup').send(testUser);
    const requestData = { email: 'test@gmail.com', newPassword: 'short' };

    // act
    const res = await request(app).post('/users/reset-password').send(requestData);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should succeed if valid email, resetCode, and password', async () => {
    // arrange
    const signupRes = await request(app).post('/users/signup').send(testUser);
    let user = await User.findOne({ email: testUser.email });
    user.resetCode = testUser.resetCode;
    user.save();

    const requestData = {
      email: testUser.email,
      resetCode: testUser.resetCode,
      newPassword: 'newpasswd'
    };

    // act
    const res = await request(app).post('/users/reset-password').send(requestData);
    user = await User.findOne({ email: requestData.email });

    // assert
    expect(signupRes.status).toBe(StatusCodes.OK);
    expect(res.status).toBe(StatusCodes.OK);
    expect(user.email).toEqual(testUser.email);
    expect(user.resetCode).toEqual('');
  });
});
