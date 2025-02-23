/**
 * @file subscribers-controller.js
 * @namespace subscribers
 * @module subscribers-controller
 * @description controller actions for subscribers endpoints
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const Subscriber = require('../models/subscriber'); // import model
const { sendResponse, validateRequest } = require('../helpers/rest-helpers');

const addSubscriber = async (req, res) => {
  const result = validateRequest(req.body, ['email']);

  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  const email = req.body.email;

  try {
    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      await new Subscriber({ email }).save();
      return sendResponse(res, 'Subscriber added', { email });
    }

    return sendResponse(res, `${email} is already a subscriber`);
  } catch (error) {
    console.error(error);
    return sendResponse(
        res, 'Error adding subscriber', {}, StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

const deleteSubscriber = async (req, res) => {
  const result = validateRequest(req.params, ['email']);

  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  const email = req.params.email;

  try {
    const subscriber = await Subscriber.findOneAndDelete({ email });

    if (!subscriber) {
      return sendResponse(res, `${email} is not a subscriber`);
    }

    return sendResponse(res, `${email} deleted from subscribers`);
  } catch (error) {
    console.error(error);
    return sendResponse(
        res, 'Error deleting subscriber', {}, StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find();

    return sendResponse(res, 'Subscribers retrieved', { subscribers });
  } catch (error) {
    console.error(error);
    return sendResponse(
        res, 'Error retrieving subscribers', {}, StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

const isEmailSubscribed = async (req, res) => {
    const result = validateRequest(req.body, ['email']);

    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    const email = req.body.email;

    try {
        const subscriber = await Subscriber.findOne({ email });

        if (!subscriber) {
        return sendResponse(res, `${email} is not a subscriber`, { subscribed: false});
        }

        return sendResponse(res, `${email} is a subscriber`, { subscribed: true });
    } catch (error) {
        console.error(error);
        return sendResponse(
            res, 'Error finding subscriber', {}, StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

const emailIsSubscribed = async (email) => {
    if (!email) {
        return false;
    }
    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
        return false;
    }
    return true;
}

module.exports = {
    addSubscriber,
    deleteSubscriber,
    getSubscribers,
    isEmailSubscribed,
    emailIsSubscribed,
};
