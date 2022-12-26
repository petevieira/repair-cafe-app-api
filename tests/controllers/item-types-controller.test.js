/**
 * @namespace tests
 * @requires controllers/item-types
 */

const mongoose = require('mongoose');
const request = require('supertest'); // for testing REST functions
const { StatusCodes } = require('http-status-codes'); // for HTTP status codes

const app = require('../../src/app');
const db = require('../database/test-database-config');
const ItemType = require('../../src/models/item-type');

// handle database connection, clearing, and disconnection, and mocks
beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('/itemTypes/addItemType', () => {
  // create test ItemType for requests
  const testItemType = {
    name: 'wrench',
    imageUrl: 'https://img.icons8.com/officel/512/toaster-oven.png'
  };

  test('should succeed for new ItemType with all fields', async () => {
    // arrange

    // act
    const res = await request(app).post('/itemTypes/addItemType').send(testItemType);

    // assert
    const itemType = await ItemType.findOne({ name: testItemType.name });
    expect(itemType).toBeTruthy();
    expect(itemType.name).toEqual(testItemType.name);
    expect(itemType.imageUrl).toEqual(testItemType.imageUrl);
  });

  test('should fail for new ItemType with missing required fields', async () => {
    // arrange
    delete testItemType.name;

    // act
    const res = await request(app).post('/itemTypes/addItemType').send(testItemType);

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    const itemType = await ItemType.findOne({ name: testItemType.name });
    expect(itemType).toBeFalsy();
  });
});

describe('/itemTypes/deleteItemType', () => {
  // create test ItemType for requests
  const testItemType = {
    name: 'Wrench',
    imageUrl: 'https://img.icons8.com/officel/512/toaster-oven.png'
  };

  test('should succeed with correct params, ItemType exiting', async () => {
    // arrange
    const itemType = await new ItemType(testItemType).save();

    // act
    const res = await request(app)
      .post('/itemTypes/deleteItemType')
      .send({ itemTypeId: itemType._id });
    const itemTypes = await ItemType.find();

    // assert
    expect(res.status).toBe(StatusCodes.OK);
    expect(itemTypes).toEqual([]);
  });

  test('should fail if ItemType does not exist', async () => {
    // arrange

    // act
    const res = await request(app)
      .post('/itemTypes/deleteItemType')
      .send({ itemTypeId: "09325" });
    const itemTypes = await ItemType.find();

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    expect(itemTypes).toEqual([]);
  });
});

describe('/itemTypes/updateItemType', () => {
  // create test ItemType for requests
  const testItemType = {
    name: 'Wrench',
    imageUrl: 'https://img.icons8.com/officel/512/toaster-oven.png'
  };

  test('should succeed with correct params, ItemType exiting', async () => {
    // arrange
    const itemType = await new ItemType(testItemType).save();

    // act
    const res = await request(app)
      .post('/itemTypes/updateItemType')
      .send({ updatedItemType: {
        _id: itemType._id,
        name: "Updated name" }
      });
    const itemTypes = await ItemType.find();

    // assert
    expect(res.status).toBe(StatusCodes.OK);
    expect(itemTypes[0].name).toEqual("Updated name");
  });

  test('should fail if ItemType does not exist', async () => {
    // arrange

    // act
    const res = await request(app)
      .post('/itemTypes/updateItemType')
      .send({ updatedItemType: {
        _id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
        name: "Updated name" }
      });
    const itemTypes = await ItemType.find();

    // assert
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    expect(itemTypes).toEqual([]);
  });
});
