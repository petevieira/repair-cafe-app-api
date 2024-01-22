
const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const Volunteer = require('../models/volunteer');
const { sendResponse, validateRequest } = require('../helpers/rest-helpers'); // validator

async function addVolunteer(req, res) {
  // Check for required request params
  const result = validateRequest(req.body,
    ['firstName', 'lastName']
  );
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  const { firstName, lastName } = req.body;

  try {
    const volunteer = await new Volunteer({
      firstName, lastName
    }).save();
    return sendResponse(res, "Volunteer added", volunteer);
  } catch (err) {
    console.error(err);
    return sendResponse(res, err, {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function deleteVolunteer(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, ['id']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  const { id } = req.body;
  const initialDocCount = await Volunteer.countDocuments({ _id: id});

  try {
    const volunteer = await Volunteer.deleteOne({ _id: id });
    const finalDocCount = await Volunteer.countDocuments({ _id: id});
    console.debug(`Count: ${initialDocCount} -> ${finalDocCount}`);
    return sendResponse(res, "Volunteer added", volunteer);
  } catch (err) {
    console.error(err);
    return sendResponse(res, err, {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getDaysVolunteers(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, ['date']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  const date = new Date(req.body.date);
  let datePlus24h = new Date(req.body.date);
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
          lastName: {
            $ifNull: [
              { $concat: [{ $toUpper: { $substrCP: ['$lastName', 0, 1] } }, '.'] },
              ''
            ]
          }
        }
      }
    ]);
    return sendResponse(res, `Found ${volunteers.length} volunteer(s)`, volunteers);
  } catch (err) {
    console.error(err);
    return sendResponse(res, err, {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = { addVolunteer, deleteVolunteer, getDaysVolunteers };
