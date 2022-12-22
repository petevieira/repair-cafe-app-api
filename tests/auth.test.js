/**
 * @requires controllers/auth
 */

const request = require('supertest');
const app = require('../src/app');
const authCtrl = require('../src/controllers/auth');

describe('Test the signup path', () => {
  test('asdfasdf', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        first: 'john',
        last: 'smith',
        email: 'test@gmail.com',
        password: 'admin'
      });
      // .set('Accept', 'application/json')
      // .expect('Content-Type', '/json/')
    //   .then(response => {
    //     expect(response.statusCode).toBe(200);
    //   });
    expect(res.statusCode).toEqual(200);
    expect(res.body)
  });
});
