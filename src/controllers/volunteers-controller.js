
const { StatusCodes } = require('http-status-codes');
const Volunteer = require('../models/volunteer');
const {
    sendResponse,
    validateRequest,
    toLowerCapFirstLetter,
    extractErrorMessage,
} = require('../helpers/rest-helpers');
const mongoose = require('mongoose');

async function addVolunteer(req, res) {
    // Check for required request params
    const result = validateRequest(req.body,
        ['firstName', 'lastName', 'email', 'acceptsWaiver', 'eventId']
    );

    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    const { firstName, lastName, email, acceptsWaiver, eventId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return sendResponse(res, "Invalid eventId", {}, StatusCodes.BAD_REQUEST);
    }

    try {
        const existingVolunteer = await Volunteer.findOne(
            { email: email, eventId: mongoose.Types.ObjectId(eventId) }
        );
        if (existingVolunteer) {
            return sendResponse(
                res,
                `Volunteer already added`,
                { volunteer: existingVolunteer },
            );
        }
        const volunteer = await new Volunteer({
            firstName, lastName, email, acceptsWaiver, eventId
        }).save();
        return sendResponse(res, "Volunteer added", { volunteer });
    } catch (err) {
        console.error(err);
        return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getVolunteer(req, res) {
    const result = validateRequest(req.params, ['id']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }
    if (req.params.id.trim() === "") {
        return sendResponse(res, "id empty", {}, StatusCodes.BAD_REQUEST);
    }

    const id = req.params.id;

    try {
        const volunteer = await Volunteer.findById(id);
        if (!volunteer) {
            return sendResponse(
                res, `No volunteer found with id ${id}`, {}, StatusCodes.BAD_REQUEST
            );
        }
        return sendResponse(
            res, `Volunteer with id ${id} found`, { volunteer: volunteer }
        );
    } catch (error) {
        console.error(error);
        return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteVolunteer(req, res) {
    // Check for required request params
    const result = validateRequest(req.params, ['id']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    try {
        const id = req.params.id;
        const volunteer = await Volunteer.deleteOne({ _id: id });
        const msg = volunteer.deletedCount > 0 ? `Volunteer deleted` : "Volunteer not found";
        return sendResponse(res, msg, { volunteer });
    } catch (error) {
        console.error(error);
        return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateVolunteer(req, res) {
    const result = validateRequest(req.body, [
        'id', 'firstName', 'lastName'
    ]);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }
    if (req.body.id === '') {
        return sendResponse(res, "id is empty", {}, StatusCodes.BAD_REQUEST);
    }

    try {
        let { id, firstName, lastName, email, acceptsWaiver } = req.body;
        firstName = toLowerCapFirstLetter(firstName);
        lastName = toLowerCapFirstLetter(lastName);

        const originalVolunteer = await Volunteer.findOneAndUpdate(
            { _id: id },
            {
                firstName,
                lastName,
                email,
                acceptsWaiver
            }
        );
        const updatedVolunteer = await Volunteer.findOne({ _id: id });

        return sendResponse(
            res, `Volunteer updated`, { volunteer: updatedVolunteer }
        );
    } catch (error) {
        console.error(error);
        return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getDaysVolunteers(req, res) {
    // Check for required request params
    const result = validateRequest(req.params, ['date']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }
    const date = new Date(req.params.date);
    let datePlus24h = new Date(req.params.date);
    datePlus24h.setDate(date.getDate() + 1);

    try {
        const volunteers = await Volunteer.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: date,
                        $lt: datePlus24h
                    }
                },
            },
            {
                $project: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1
                }
            }
        ]);
        return sendResponse(
            res,
            `Found ${volunteers.length} volunteer(s)`,
            { volunteers: volunteers }
        );
    } catch (error) {
        console.error(error);
        return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getVolunteersByEvent(req, res) {
    const result = validateRequest(req.params, ['eventId']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    const eventId = req.params.eventId;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return sendResponse(res, "Invalid eventId", {}, StatusCodes.BAD_REQUEST);
    }

    console.debug(`Finding volunteers for event ${eventId}`);

    try {
        const volunteers = await Volunteer.aggregate([
            {
                $match: {
                    eventId: mongoose.Types.ObjectId(eventId)
                }
            },
            {
                $project: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                },
            }
        ]);
        console.debug("Volunteers found: ", volunteers);
        return sendResponse(
            res,
            `Found ${volunteers.length} volunteer(s) for event ${req.params.eventId}`,
            { volunteers: volunteers }
        );
    } catch (error) {
        return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getPastVolunteers(req, res) {
    try {
        const volunteers = await Volunteer.aggregate(
            [
                // Exclude documents with missing email
                {
                    $match: {
                        email: {
                            $exists: true,
                            $ne: null
                        }
                    }
                },
                // Find distinct volunteers based on first and last name
                {
                    $group: {
                        _id: "$email",
                        "doc": { "$first": "$$ROOT"}
                    }
                },
                {
                    $replaceRoot: {
                        "newRoot": "$doc"
                    }
                },
                // Sort by updatedAt date in descending order
                {
                    $sort: { updatedAt: -1 }
                },
            ]
        );
        return sendResponse(
            res,
            `Found ${volunteers.length} unique volunteer(s)`,
            { pastVolunteers: volunteers }
        );
    } catch (error) {
        return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function findVolunteerByEmail(req, res) {
    const result = validateRequest(req.params, ['email']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    try {
        const volunteer = await Volunteer.findOne({email: req.params.email});
        if (!volunteer) {
            return sendResponse(res, "Email not registered", { volunteer: null });
        }

        return sendResponse(
            res,
            `Found volunteer with email ${req.params.email}`,
            { volunteer: volunteer }
        );
    } catch (error) {
        return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addVolunteer,
    updateVolunteer,
    deleteVolunteer,
    getDaysVolunteers,
    getVolunteer,
    getPastVolunteers,
    findVolunteerByEmail,
    getVolunteersByEvent,
};
