/**
 * @file events-controller.js
 * @module events
 * @description controller actions for events endpoints
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const Event = require('../models/event'); // import Event model
const { validateRequest } = require('../helpers/request-helper'); // validator
require("dotenv").config(); // parse .env file

/**
 * adds an event to the events collection if the request is valid.
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} response with Event object that was added or an error
 */
async function addEvent(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, [
    'title', 'description', 'locationName', 'locationAddress',
    'startDatetime', 'endDatetime', 'imageUrl']);
  if (result !== true) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: result });
  }

  try {
    // extract request body parameters
    const {
      title, description, locationName, locationAddress,
      startDatetime, endDatetime, imageUrl
    } = req.body;

    // check if email already exists in the database
    const existingEvent = await Event.findOne({
      locationName: locationName, startDatetime: startDatetime });
    if (existingEvent) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Event already exists: " + JSON.stringify(existingEvent) });
    }

    // create and save new user document to the database
    const event = await new Event({
      title, description, locationName, locationAddress,
      startDatetime, endDatetime, imageUrl
    }).save();

    // respond to client with token and user object, excluding password
    return res.json({ event: event });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err});
  }
}

/**
 * adds an event to the events collection if the request is valid.
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} response with Event object that was added or an error
 */
async function deleteEvent(req, res) {
  return res.status(StatusCodes.OK);
}

/**
 * adds an event to the events collection if the request is valid.
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} response with Event object that was added or an error
 */
async function updateEvent(req, res) {
  return res.status(StatusCodes.OK);
}

/**
 * adds an event to the events collection if the request is valid.
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} response with Event object that was added or an error
 */
async function getEvents(req, res) {
  return res.status(StatusCodes.OK);
}

module.exports = { addEvent, deleteEvent, updateEvent, getEvents };
