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
        res, 'Error adding subscriber. ' + error.message, {}, StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

const deleteSubscriber = async (req, res) => {
  const result = validateRequest(req.body, ['email']);

  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  const email = req.body.email;

  try {
    const subscriber = await Subscriber.findOneAndDelete({ email });

    if (!subscriber) {
      return sendResponse(res, `${email} is not a subscriber`);
    }

    const msg = subscriber.deletedCount > 0 ? `Subscriber ${id} deleted` : "Subscriber not found";

    return sendResponse(res, msg, { subscriber });
  } catch (error) {
    console.error(error);
    return sendResponse(
        res, 'Error deleting subscriber. ' + error.message, {}, StatusCodes.INTERNAL_SERVER_ERROR
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
        res, 'Error retrieving subscribers. ' + error.message, {}, StatusCodes.INTERNAL_SERVER_ERROR
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
            return sendResponse(res, `${email} is not subscribed`, { isSubscribed: false});
        }

        return sendResponse(res, `${email} is subscribed`, { isSubscribed: true });
    } catch (error) {
        console.error(error);
        return sendResponse(
            res, 'Error finding subscriber. ' + error.message, {}, StatusCodes.INTERNAL_SERVER_ERROR
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
