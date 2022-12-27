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

describe('/itemTypes/addItemTypes', () => {
  let newItemTypes = [
    {
      "name": "toaster",
      "imageUrl": "https://icons8.com/icon/49317/toaster"
    },
    {
      "name": "toaster oven",
      "imageUrl": "https://icons8.com/icon/30196/toaster-oven"
    },
    {
      "name": "microwave",
      "imageUrl": "https://icons8.com/icon/ylW4eW4IeVUV/microwave"
    },
    {
      "name": "guitar amp",
      "imageUrl": "https://icons8.com/icon/ylW4eW4IeVUV/microwave"
    },
    {
      "name": "blender",
      "imageUrl": "https://icons8.com/icon/Trn9nfJhOhcM/blender"
    },
    {
      "name": "camera",
      "imageUrl": "https://icons8.com/icon/Trn9nfJhOhcM/blender"
    },
    {
      "name": "cd player",
      "imageUrl": "https://icons8.com/icon/D836fJ5tyTvR/cd-drive"
    },
    {
      "name": "chair",
      "imageUrl": "https://icons8.com/icon/2MG-emmtaHBn/office-chair"
    },
    {
      "name": "coffee maker",
      "imageUrl": "https://icons8.com/icon/oQGK0Tuybu6b/coffee-maker"
    },
    {
      "name": "laptop computer",
      "imageUrl": "https://icons8.com/icon/31188/laptop-with-cursor"
    },
    {
      "name": "clothing",
      "imageUrl": "https://icons8.com/icon/42167/shirt"
    },
    {
      "name": "fryer",
      "imageUrl": "https://icons8.com/icon/p0slnubc8GNS/appliance"
    },
    {
      "name": "humidifier",
      "imageUrl": "https://icons8.com/icon/B2TNaXfjXaTD/humidifier"
    },
    {
      "name": "dehumidifier",
      "imageUrl": "https://icons8.com/icon/MpPKtvzx5vnD/dehumidifier"
    },
    {
      "name": "espresso maker",
      "imageUrl": "https://icons8.com/icon/OvzhgZSibr7O/coffee-maker"
    },
    {
      "name": "headphones",
      "imageUrl": "https://icons8.com/icon/9FnB28LIZvp0/headphones"
    },
    {
      "name": "earbud headphones",
      "imageUrl": "https://icons8.com/icon/56030/earbud-headphones"
    },
    {
      "name": "ice cream maker",
      "imageUrl": "https://icons8.com/icon/XXaMKRPapHuQ/ice-cream-maker"
    },
    {
      "name": "ice maker",
      "imageUrl": "https://icons8.com/icon/AXNcrm9MqPia/ice-maker"
    },
    {
      "name": "iron",
      "imageUrl": "https://icons8.com/icon/30133/iron"
    },
    {
      "name": "juicer",
      "imageUrl": "https://icons8.com/icon/gzvxOngLfMI7/juicer"
    },
    {
      "name": "kettle",
      "imageUrl": "https://icons8.com/icon/30104/electric-teapot"
    },
    {
      "name": "lamp",
      "imageUrl": "https://icons8.com/icon/30092/desk-lamp"
    },
    {
      "name": "hand mixer",
      "imageUrl": "https://icons8.com/icon/4imL86yTlV4I/mixer"
    },
    {
      "name": "food mixer",
      "imageUrl": "https://icons8.com/icon/HW7Wk1Kzi5c4/mixer"
    },
    {
      "name": "record player",
      "imageUrl": "https://icons8.com/icon/ec1yIpS5ceSr/recorder-player"
    },
    {
      "name": "tape player",
      "imageUrl": "https://icons8.com/icon/zsGZ0NCavXPn/tape-player"
    },
    {
      "name": "sewing machine",
      "imageUrl": "https://icons8.com/icon/1JHVeAPZDWRY/sewing-machine"
    },
    {
      "name": "rice cooker",
      "imageUrl": "https://icons8.com/icon/Cd7Xzv1729Uw/rice-cooker"
    },
    {
      "name": "slow cooker, crockpot, instapot",
      "imageUrl": "https://icons8.com/icon/GMBNG1hZD65w/cooking"
    },
    {
      "name": "cell phone",
      "imageUrl": "https://icons8.com/icon/67375/iphone-se"
    },
    {
      "name": "speaker",
      "imageUrl": "https://icons8.com/icon/bG7d9gl4A78W/subwoofer"
    },
    {
      "name": "television, tv",
      "imageUrl": "https://icons8.com/icon/43257/tv",
    },
    {
      "name": "vacuum",
      "imageUrl": "https://icons8.com/icon/33FmjAutaNIa/vacuum"
    },
    {
      "name": "waffle iron",
      "imageUrl": "https://icons8.com/icon/ebcnUazrzT6T/baker"
    },
    {
      "name": "water dispenser",
      "imageUrl": "https://icons8.com/icon/ebcnUazrzT6T/baker"
    },
    {
      "name": "fan",
      "imageUrl": "https://icons8.com/icon/zC6zk1V4uoNs/fan"
    },
    {
      "name": "radio",
      "imageUrl": "https://icons8.com/icon/67oLavas7EXC/radio-station"
    },
    {
      "name": "amplifier, stereo",
      "imageUrl": "https://icons8.com/icon/3oO5xY2qsKMC/amplifier",
    },
    {
      "name": "medical device",
      "imageUrl": "https://icons8.com/icon/3oO5xY2qsKMC/amplifier"
    },
    {
      "name": "massager",
      "imageUrl": "https://icons8.com/icon/ZPGIVRc1B9Ft/massager"
    },
    {
      "name": "headlamp",
      "imageUrl": "https://icons8.com/icon/L2PtWHY_26ht/headlamp"
    },
    {
      "name": "vcr",
      "imageUrl": "https://icons8.com/icon/bLQGnhebPkoS/videocassette"
    },
    {
      "name": "gaming console",
      "imageUrl": "https://icons8.com/icon/Qd6wpO90wyP3/console"
    },
    {
      "name": "gaming controller",
      "imageUrl": "https://icons8.com/icon/Ig90y3QoWr6s/nintendo-switch-pro-controller"
    },
    {
      "name": "paper shredder",
      "imageUrl": "https://icons8.com/icon/3wMQ3JUqjPpG/shredder"
    },
    {
      "name": "other",
      "imageUrl": "https://icons8.com/icon/A801MPA8NfXC/question"
    }
  ];

  test('should add all ItemTypes', async () => {
    // arrange

    // act
    const res = await request(app)
      .post('/itemTypes/addItemTypes')
      .send({ itemTypes: newItemTypes });
    const itemTypes = await ItemType.find();

    // assert
    expect(res.status).toBe(StatusCodes.OK);
    expect(itemTypes.length).toEqual(newItemTypes.length);
  });

  test('should fail if name or imageUrl is missing or empty', async () => {
    // arrange
    newItemTypes[2].name = '';
    newItemTypes[5].imageUrl = '';
    delete newItemTypes[13].name;
    delete newItemTypes[30].imageUrl;

    // act
    const res = await request(app)
      .post('/itemTypes/addItemTypes')
      .send({ itemTypes: newItemTypes });
    const itemTypes = await ItemType.find();

    // assert
    expect(res.status).toBe(StatusCodes.MULTI_STATUS);
    expect(itemTypes.length).toEqual(newItemTypes.length - 4);
  });
});
