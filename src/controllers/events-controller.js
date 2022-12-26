/**
 * @module test
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
 * @param {string} req.body.title - title of event
 * @param {string} req.body.description - description of event
 * @param {string} req.body.locationName - name of location of event
 * @param {string} req.body.locationAddress - address of location of event
 * @param {Date}   req.body.startDatetime - start date and time of event
 * @param {Date}   req.body.endDatetime - end date and time of event
 * @param {string} req.body.imageUrl - URL of an image for the event
 * @param {object} res - response object
 * @param {object} res.body.event - event that was added
 * @param {string} res.body.error - error message, if request fails
 * @returns {object} response, 'res'
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
        .json({
          error: "Event already exists: " + JSON.stringify(existingEvent)
        });
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
 * deletes an event from the events collection if the request is valid.
 * startDatetime is provided to select which event to delete.
 * assumption is user with select from events and have the
 *   startDatetime available.
 * @function
 * @param {object} req - request object
 * @param {string} req.body.eventId - _id of Event to delete
 * @param {object} res - response object
 * @param {object} res.body.msg - success message on success
 * @param {string} res.body.error - error message on failure
 * @returns {object} response, 'res'
 */
async function deleteEvent(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, ['eventId']);
  if (result !== true) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: result });
  }

  const { eventId } = req.body;

  try {
    await Event.findByIdAndDelete(eventId);
    return res.status(StatusCodes.OK).json({ msg: "Event deleted" });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err });
  }
}

/**
 * updates an existing event if the request is valid.
 * @function
 * @param {object} req - request object
 * @param {object} req.body.updatedEvent - Event object with desired updated
 *   properties. it must at least contain '_id' to find the Event to update.
 * @param {object} res - response object
 * @param {object} res.body.updatedEvent - updated event, on success
 * @param {string} res.body.error - error message, on failure
 * @returns {object} response, 'res'
 */
async function updateEvent(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, ['updatedEvent']);
  if (result !== true) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: result });
  }

  const { updatedEvent } = req.body;

  try {
    const event = await Event.findById(updatedEvent._id);
    // make sure event was found
    if (!event) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `No event found with id ${updatedEvent._id}` });
    }
    // update document based on request
    event.title = updatedEvent.title ?? event.title;
    event.description = updatedEvent.description ?? event.description;
    event.locationName = updatedEvent.locationName ?? event.locationName;
    event.locationAddress = updatedEvent.locationAddress ?? event.locationAddress;
    event.startDatetime = updatedEvent.startDatetime ?? event.startDatetime;
    event.endDatetime = updatedEvent.endDatetime ?? event.endDatetime;
    event.imageUrl = updatedEvent.imageUrl ?? event.imageUrl;
    const savedEvent = await event.save();
    return res.json({ updatedEvent: savedEvent });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err });
  }
}

/**
 * gets all the events in the collection
 * @function
 * @param {object} req - request object. no parameters should be sent.
 * @param {object} res - response object
 * @param {array} res.body.events - array of all the events, on success
 * @param {string} res.body.error - error message, on failure
 * @returns {object} response, 'res'
 */
async function getEvents(req, res) {
  try {
    const events = await Event.find();
    return res.status(StatusCodes.OK).json({ events: events });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err });
  }
}

module.exports = { addEvent, deleteEvent, updateEvent, getEvents };
