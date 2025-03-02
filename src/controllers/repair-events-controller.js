/**
 * @file events-controller.js
 * @namespace events
 * @module events-controller
 * @description controller actions for events endpoints
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const RepairEvent = require('../models/repair-event'); // import model
const { sendResponse, validateRequest } = require('../helpers/rest-helpers');

/**
 * Creates event with date set to midnight UTC.
 * @param {*} req - Request object
 * @param {*} req.body - Request body
 * @param {*} req.body.date - Date of event with time set to midnight UTC
 * @param {*} res - Response object
 * @returns {object} - Response object with status, message, and created/found event
 */
const createEvent = async (req, res) => {
    const result = validateRequest(req.body, ['date']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    const date = new Date(req.body.date);

    if (date.getUTCHours() !== 0 || date.getUTCMinutes() !== 0 || date.getUTCSeconds() !== 0) {
        return sendResponse(res, 'Date must be at midnight UTC', {}, StatusCodes.BAD_REQUEST);
    }

    try {
        const foundEvent = await RepairEvent.findOne({ date: date });

        if (!foundEvent) {
            newEvent = await new RepairEvent({ date }).save();
            if (!newEvent) {
                return sendResponse(
                    res, 'Error adding event', {}, StatusCodes.INTERNAL_SERVER_ERROR
                );
            }
            const msg = `Event added with date ${date.toUTCString()}`;
            return sendResponse(res, msg, { createdEvent: newEvent }, StatusCodes.CREATED);
        }

        const msg = `Event with date ${date.toUTCString()} already exists`;
        return sendResponse(res, msg, { createdEvent: foundEvent });
    } catch (error) {
        console.error(error);
        return sendResponse(
            res, 'Error adding event' + error.message, {}, StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

const deleteEventById = async (req, res) => {
    const result = validateRequest(req.params, ['id']);

    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    const id = req.params.id;

    try {
        const event = await RepairEvent.findOneAndDelete({ _id: id });

        if (!event) {
            return sendResponse(res, `Event with _id ${id} not found`);
        }

        return sendResponse(res, `Event with id ${id} deleted`, { deletedEvent: event });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'Error deleting event', {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const updateEvent = async (req, res) => {
    let result = validateRequest(req.body, ['event']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    const requestEvent = req.body.event;

    result = validateRequest(requestEvent, ['_id', 'date']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    try {
        const updatedEvent = await RepairEvent.findOneAndUpdate(
            { _id: requestEvent._id },
            { date: requestEvent.date },
            { new: true }
        );

        if (!updatedEvent) {
            return sendResponse(res, `Event with id ${requestEvent._id} not found`);
        }

        return sendResponse(
            res,
            `Event ${updatedEvent._id} date updated to ${updatedEvent.date.toUTCString()}`,
            { updatedEvent }
        );
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'Error updating event', {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const getEvents = async (req, res) => {
    try {
        const events = await RepairEvent.find();

        return sendResponse(res, 'Events retrieved', { events });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'Error retrieving events', {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const getEventById = async (req, res) => {
    const result = validateRequest(req.body, ['id']);

    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    const id = req.body.id;

    try {
        const event = await RepairEvent.findOne({ _id: id });

        if (!event) {
            return sendResponse(res, `Event with id ${id} not found`);
        }

        return sendResponse(res, `Event with id ${id} retrieved`, { event });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'Error retrieving event', {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get most recent event not in the future
 */
const getMostRecentEvent = async (req, res) => {
    const result = validateRequest(req.body, ['todaysDate']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    todaysDate = new Date(req.body.todaysDate);
    if (
        !todaysDate ||
        todaysDate.getUTCHours() !== 0 ||
        todaysDate.getUTCMinutes() !== 0 ||
        todaysDate.getUTCSeconds() !== 0
    ) {
        return sendResponse(res, 'Date must be at midnight UTC', {}, StatusCodes.BAD_REQUEST);
    }

    try {
        const mostRecentEvent = await
            RepairEvent.findOne({ date: { $lte: todaysDate } })
                .sort({ date: -1 });
        if (!mostRecentEvent) {
            return sendResponse(res, 'No events found');
        }
        return sendResponse(res, 'Most recent event retrieved', { mostRecentEvent });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'Error retrieving most recent event', {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

/**
 * Get event by date
 * @param {object} req - Request object
 * @param {object} req.body - Request body
 * @param {string} req.body.date - Date of event
 * @param {object} res - Response object
 */
const getEventByDate = async (req, res) => {
    const result = validateRequest(req.body, ['date']);

    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    const inputDate = req.body.date;
    inputDate.set

    try {
        const event = await RepairEvent.findOne({ date: date });

        if (!event) {
            return sendResponse(res, `Event with date ${date} not found`);
        }

        return sendResponse(res, `Event with date ${date} retrieved`, { event });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'Error retrieving event', {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const getPreviousEvent = async (req, res) => {
    const result = validateRequest(req.body, ['currentDate']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    currentDate = new Date(req.body.currentDate);
    if (
        !currentDate ||
        currentDate.getUTCHours() !== 0 ||
        currentDate.getUTCMinutes() !== 0 ||
        currentDate.getUTCSeconds() !== 0
    ) {
        return sendResponse(res, 'Current date must be at midnight UTC', {}, StatusCodes.BAD_REQUEST);
    }

    try {
        const event = await
            RepairEvent.findOne({ date: { $lt: currentDate } })
                .sort({ date: -1 });
        if (!event) {
            return sendResponse(res, 'No previous events found');
        }
        return sendResponse(res, 'Prevoius event retrieved', { event });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'Error retrieving previous event', {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

const getNextEvent = async (req, res) => {
    const result = validateRequest(req.body, ['currentDate']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    currentDate = new Date(req.body.currentDate);
    if (
        !currentDate ||
        currentDate.getUTCHours() !== 0 ||
        currentDate.getUTCMinutes() !== 0 ||
        currentDate.getUTCSeconds() !== 0
    ) {
        return sendResponse(res, 'Current date must be at midnight UTC', {}, StatusCodes.BAD_REQUEST);
    }

    try {
        const event = await
            RepairEvent.findOne({ date: { $gt: currentDate } })
                .sort({ date: -1 });
        if (!event) {
            return sendResponse(res, 'No events found');
        }
        return sendResponse(res, 'Next event retrieved', { event });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'Error retrieving next event', {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    createEvent,
    deleteEventById,
    updateEvent,
    getEvents,
    getEventById,
    getMostRecentEvent,
    getEventByDate,
    getPreviousEvent,
    getNextEvent,
};
