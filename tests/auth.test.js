/**
 * @requires controllers/auth
 */

const request = require('supertest');
const app = require('../app');
const authCtrl = require('../controllers/auth');

describe('Test the signup path', () => {
  test('', () => {
    return request(app)
      .post('/signup')
      .send({first: 'john', last: 'smith', email: 'test@gmail.com', password: 'admin'})
      .set('Accept', 'application/json')
      .expect('Content-Type', '/json/')
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
});
