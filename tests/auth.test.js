/**
 * @requires controllers/auth
 */

const request = require('supertest');
const app = require('../src/app');
const authCtrl = require('../src/controllers/auth');
const db = require('../src/database/database-config');

// beforeAll(async () => await db.connect());
// afterEach(async () => await db.closeAndStop());
// afterAll(async () => await db.dropCollections());

describe('Test the signup path', () => {
  test('asdfasdf', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        first: 'john',
        last: 'smith',
        email: 'test@gmail.com',
        password: 'adminpassword'
      });
      // .set('Accept', 'application/json')
      // .expect('Content-Type', '/json/')
    //   .then(response => {
    //     expect(response.statusCode).toBe(200);
    //   });
    // expect(res.statusCode).toEqual(200);
    console.debug(res.body);
  });
});
