/**
 * @requires controllers/events
 */

jest.mock('@sendgrid/mail');
const sgMail = require('@sendgrid/mail');
const defaultMailOptions = { response: 'Okay' };

const request = require('supertest'); // for testing CRUD functions
const { StatusCodes } = require('http-status-codes'); // for HTTP status codes

const app = require('../../src/app');
const db = require('../database/test-database-config');
const Event = require('../../src/models/event');

// handle database connection, clearing, and disconnection, and mocks
beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('/events/addEvent', () => {
  // create test event for requests
  const testEvent = {
    title: 'Second Saturday Repair Event',
    description: 'Come, come, come',
    locationName: 'Xerocraft',
    locationAddress: '123 W 4th Ave., Tucson, AZ, 85750',
    startDatetime: new Date('2022-12-24T16:00:00'),
    endDatetime: new Date('2022-12-24T20:00:00'),
    imageUrl: 'https://us1-photo.nextdoor.com/post_photos/82/36/8236daa8447dcdfe06a333e6ca464e64.jpg?request_version=v2&output_type=jpg&sizing=linear&x_size=6&resize_type=resize',
  };

  test('should succeed for new event with all fields', async () => {
    // arrange

    // act
    const res = await request(app).post('/events/addEvent').send(testEvent);

    // assert
    const event = await Event.findOne({ locationName: testEvent.locationName });
    expect(event).toBeTruthy();
    expect(event.title).toEqual(testEvent.title);
    expect(event.locationName).toEqual(testEvent.locationName);
    expect(event.startDatetime).toEqual(testEvent.startDatetime);
  });

  test('should fail for new event with missing required fields', async () => {
    // arrange
    delete testEvent.title;

    // act
    const res = await request(app).post('/events/addEvent').send(testEvent);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    const event = await Event.findOne({ locationName: testEvent.locationName });
    expect(event).toBeFalsy();
  });
});

describe('/events/deleteEvent', () => {
  test('should succeed if correct params sent, regardless of existence of event', async () => {
    
  });
});

