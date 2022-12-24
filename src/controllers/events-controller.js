/**
 * @file events-controller.js
 * @module events
 * @description controller actions for events endpoints
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const { Event } = require('../models/event'); // import Event model
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
  const result = validateRequest(req.body, ['']);
  if (result !== true) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: result });
  }

  try {
    // extract request body parameters
    const { first, last, email, password } = req.body;

    // check if email already exists in the database
    const exist = await User.findOne({ email: email });
    if (exist) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Email is taken" });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // create and save new user document to the database
    const user = await new User({
      first,
      last,
      email,
      password: hashedPassword,
      roles: ['user']
    }).save();

    // create signed token
    const token = createSignedJwtToken(
      user._id, process.env.JWT_SECRET, TOKEN_EXPIRATION);

    // separate password from the rest of the fields in the user document
    const { pwd, ...rest } = user._doc;

    // respond to client with token and user object, excluding password
    return res.json({ token, user: rest });
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
