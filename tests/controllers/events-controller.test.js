/**
 * @requires controllers/users
 */

jest.mock('@sendgrid/mail');
const sgMail = require('@sendgrid/mail');
const defaultMailOptions = { response: 'Okay' };

const request = require('supertest'); // for testing CRUD functions
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes'); // for HTTP status codes

const app = require('../../src/app');
const db = require('../database/test-database-config');
const Event = require('../../src/models/event');

// handle database connection, clearing, and disconnection, and mocks
beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('/events/addEvent', () => {
  // test user for requests
  const testEvent = new Event({
    title: 'Second Saturday Repair Event',
    description: 'Come, come, come',
    locationName: 'Xerocraft',
    locationAddress: '123 W 4th Ave., Tucson, AZ, 85750',
    startDateTime: new Date('2022-12-24T16:00:00'),
    endDateTime: new Date('2022-12-24T20:00:00'),
    imageUrl: 'https://us1-photo.nextdoor.com/post_photos/82/36/8236daa8447dcdfe06a333e6ca464e64.jpg?request_version=v2&output_type=jpg&sizing=linear&x_size=6&resize_type=resize',
  });

  test('should succeed for new user with all fields', async () => {
    // arrange

    // act
    const res = await request(app).post('/events/addEvent').send(testEvent);
    const event = await Event.findOne({ startDateTime: testEvent.startDateTime });

    // assert
    expect(event).toBeTruthy();
    expect(event.title).toEqual(testEvent.title);
  });
});

