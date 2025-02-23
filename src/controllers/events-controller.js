/**
 * @file events-controller.js
 * @namespace events
 * @module events-controller
 * @description controller actions for events endpoints
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const Event = require('../models/event'); // import model
const { sendResponse, validateRequest } = require('../helpers/rest-helpers');

const toIsoDateMightnightUTC = (yyyyMmDdString) => {
    return new Date(`${yyyyMmDdString}T00:00:00Z`);
}

const createEvent = async (req, res) => {
    const result = validateRequest(req.body, ['date']);

    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    // Check if date is in the format yyyyMMdd
    const dateFormat = "YYYY-MM-DD";
    if (req.body.date.length !== dateFormat.length) {
        return sendResponse(
            res,
            `Date must be in format ${dateFormat}, but received ${req.body.date}`,
            {},
            StatusCodes.BAD_REQUEST
        );
    }

    const date = toIsoDateMightnightUTC(req.body.date);
    console.log(date);

    try {
        const event = await Event.findOne({ date: date });

        if (!event) {
            await new Event({ date }).save();
            return sendResponse(res, `Event added with date ${date}`, { date }, event);
        }

        return sendResponse(res, `Event with date ${date} already exists`, event);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'Error adding event' + error.message, {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const deleteEventById = async (req, res) => {
    const result = validateRequest(req.params, ['id']);

    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    const date = req.params.id;

    try {
        const event = await Event.findOneAndDelete({ _id: id });

        if (!event) {
            return sendResponse(res, `Event with _id ${id} not found`);
        }

        return sendResponse(res, `Event with id ${id} deleted`);
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

    result = validateRequest(req.body.event, ['_id', 'date']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    const event = req.body.event;

    try {
        const event = await Event.findOneAndUpdate(
            { _id: event._id }, { date: event.date }, { new: true }
        );

        if (!event) {
            return sendResponse(res, `Event with id ${event._id} not found`);
        }

        return sendResponse(res, `Event ${event._id} date updated to ${event.date}`, { event });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'Error updating event', {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const getEvents = async (req, res) => {
    try {
        const events = await Event.find();

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
        const event = await Event.findOne({ _id: id });

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
    try {
        const event = await
            Event.findOne({ date: { $lte: new Date() } })
                .sort({ date: -1 });
        if (!event) {
            return sendResponse(res, 'No events found');
        }
        return sendResponse(res, 'Most recent event retrieved', { event });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 'Error retrieving most recent event', {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    createEvent,
    deleteEventById,
    updateEvent,
    getEvents,
    getEventById,
    getMostRecentEvent,
};
