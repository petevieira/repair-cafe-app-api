/**
 * @file events-controller.js
 * @namespace events
 * @module events-controller
 * @description controller actions for events endpoints
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const Event = require('../models/event'); // import Event model
const { sendResponse, validateRequest } = require('../helpers/rest-helpers'); // validator

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
 * @param {string} res.body.msg - error message, if request fails
 * @returns {object} response, 'res'
 */
async function addEvent(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, [
    'title', 'description', 'locationName', 'locationAddress',
    'startDatetime', 'endDatetime', 'imageUrl']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    // extract request body parameters
    const {
      title, description, locationName, locationAddress,
      startDatetime, endDatetime, imageUrl
    } = req.body;

    // check if email already exists in the database
    const eventExists = await Event.findOne({
      locationName: locationName, startDatetime: startDatetime });
    if (eventExists) {
      return sendResponse(
        res,
        'Event already exists: ' + JSON.stringify(eventExists),
        {},
        StatusCodes.BAD_REQUEST);
    }

    // create and save new user document to the database
    const event = await new Event({
      title, description, locationName, locationAddress,
      startDatetime, endDatetime, imageUrl
    }).save();

    // respond to client with token and user object, excluding password
    return sendResponse(res, 'Event added successfully', event);
  } catch (err) {
    console.error(err);
    return sendResponse(res, err, {}, StatusCodes.INTERNAL_SERVER_ERROR);
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
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);;
  }

  const { eventId } = req.body;

  try {
    await Event.findByIdAndDelete(eventId);
    return sendResponse(res, 'Event deleted successfully', {}, StatusCodes.OK);
  } catch (err) {
    return sendResponse(res, err, {}, StatusCodes.BAD_REQUEST);
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
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  const { updatedEvent } = req.body;

  try {
    const event = await Event.findById(updatedEvent._id);
    // make sure event was found
    if (!event) {
      return sendResponse(res,
        `No event found with id ${updatedEvent._id}`, {},
        StatusCodes.BAD_REQUEST);
    }
    // update document based on request
    event.title = updatedEvent.title || event.title;
    event.description = updatedEvent.description || event.description;
    event.locationName = updatedEvent.locationName || event.locationName;
    event.locationAddress = updatedEvent.locationAddress || event.locationAddress;
    event.startDatetime = updatedEvent.startDatetime || event.startDatetime;
    event.endDatetime = updatedEvent.endDatetime || event.endDatetime;
    event.imageUrl = updatedEvent.imageUrl || event.imageUrl;
    const savedEvent = await event.save();
    return sendResponse(res, 'Event updated successfully', savedEvent);
  } catch (err) {
    return sendResponse(res, err, {}, StatusCodes.BAD_REQUEST);
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
  let filter = {};
  if (req.body.filter !== undefined) {
    filter = req.body.filter;
  }
  try {
    const events = await Event.find(filter);
    return sendResponse(res, 'Retrieved events successfully', events);
  } catch (err) {
    return sendResponse(res, err, {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = { addEvent, deleteEvent, updateEvent, getEvents };
