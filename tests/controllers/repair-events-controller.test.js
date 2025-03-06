/**
 * @namespace tests
 * @requires controllers/events
 */

const mongoose = require('mongoose');
const request = require('supertest'); // for testing REST functions
const { StatusCodes } = require('http-status-codes'); // for HTTP status codes

const app = require('../../src/app');
const db = require('../database/test-database-config');
const RepairEvent = require('../../src/models/repair-event');
const Auth = require('../../src/helpers/auth-helpers');

let token;
// handle database connection, clearing, and disconnection, and mocks
beforeAll(async () => await db.connect());
beforeEach(async () => {
  // we need to get an auth token to access events endpoints
  token = Auth.createSignedToken('103');
});
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('/repair-events/create-event', () => {
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
    const res = await request(app)
      .post('/repair-events/create-event')
      .set('Authorization', `Bearer ${token}`)
      .send(testEvent);

    // assert
    const event = await RepairEvent.findOne({ locationName: testEvent.locationName });
    expect(event).toBeTruthy();
    expect(event.title).toEqual(testEvent.title);
    expect(event.locationName).toEqual(testEvent.locationName);
    expect(event.startDatetime).toEqual(testEvent.startDatetime);
  });

  test('should fail for new event with missing required fields', async () => {
    // arrange
    delete testEvent.title;

    // act
    const res = await request(app)
      .post('/repair-events/create-event')
      .set('Authorization', `Bearer ${token}`)
      .send(testEvent);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    const event = await RepairEvent.findOne({ locationName: testEvent.locationName });
    expect(event).toBeFalsy();
  });
});

describe('/repair-events/delete-event-by-id', () => {
  // create test event for requests
  const testEvent = {
    title: 'Second Saturday Repair Event',
    description: 'Come, come, come',
    locationName: 'Xerocraft',
    locationAddress: '123 W 4th Ave., Tucson, AZ, 85750',
    startDatetime: new Date('2022-12-24T16:00:00'),
    endDatetime: new Date('2022-12-24T20:00:00'),
    imageUrl: 'https://us1-photo.nextdoor.com/post_photos/' +
      '82/36/8236daa8447dcdfe06a333e6ca464e64.jpg?request_version=v2' +
      '&output_type=jpg&sizing=linear&x_size=6&resize_type=resize',
  };

  test('should succeed with correct params, event exiting', async () => {
    // arrange
    const event = await new RepairEvent(testEvent).save();

    // act
    const res = await request(app)
      .delete('/repair-events/delete-event-by-id/' + event._id)
      .set('Authorization', `Bearer ${token}`);
    const events = await RepairEvent.find();

    // assert
    expect(res.status).toBe(StatusCodes.OK);
    expect(events).toEqual([]);
  });

  test('should fail if event does not exist', async () => {
    // arrange

    // act
    const res = await request(app)
      .delete('/repair-events/delete-event-by-id/09325')
      .set('Authorization', `Bearer ${token}`)
    const events = await RepairEvent.find();

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
});

describe('/repair-events/update-event', () => {
  // create test event for requests
  const testEvent = {
    title: 'Second Saturday Repair Event',
    description: 'Come, come, come',
    locationName: 'Xerocraft',
    locationAddress: '123 W 4th Ave., Tucson, AZ, 85750',
    startDatetime: new Date('2022-12-24T16:00:00'),
    endDatetime: new Date('2022-12-24T20:00:00'),
    imageUrl: 'https://us1-photo.nextdoor.com/post_photos/' +
      '82/36/8236daa8447dcdfe06a333e6ca464e64.jpg?request_version=v2' +
      '&output_type=jpg&sizing=linear&x_size=6&resize_type=resize',
  };

  test('should succeed with correct params, event exiting', async () => {
    // arrange
    const event = await new RepairEvent(testEvent).save();

    // act
    const res = await request(app)
      .post('/repair-events/update-event')
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedEvent: {
        _id: event._id,
        title: "Updated title" }
      });
    const events = await RepairEvent.find();

    // assert
    expect(res.status).toBe(StatusCodes.OK);
    expect(events[0].title).toEqual("Updated title");
  });

  test('should fail if event does not exist', async () => {
    // arrange

    // act
    const res = await request(app)
      .post('/repair-events/update-event')
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedEvent: {
        _id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
        title: "Updated title" }
      });
    const events = await RepairEvent.find();

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    expect(events).toEqual([]);
  });
});
