/**
 * @file users-controller.js
 * @namespace users
 * @module users-controller
 * @description controller actions for user authentication endpoints
 * @requires jsonwebtoken
 * @requires nanoid
 */

const nanoid = require('nanoid'); // to generate unique reset code
const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const User = require('../models/user'); // import User model
const { comparePassword, createSignedToken } = require('../helpers/auth-helpers'); // password helpers
const { sendResponse, validateRequest } = require('../helpers/rest-helpers'); // validator
require("dotenv").config(); // parse .env file
// const sgMail = require("@sendgrid/mail"); // for sending emails

// configure SendGrid email API
// sgMail.setApiKey(process.env.SENDGRID_KEY);

async function userIsAdmin(req, res) {
  // Check for required request params
  const result = validateRequest(req.params, ['email']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  const email = req.params.email;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return sendResponse(
        res, `User with email ${email} not found`, {}, StatusCodes.BAD_REQUEST
      );
    }
    if (user.role !== "admin") {
      return sendResponse(
        res, `User with email ${email} isn't an admin`,
        {}, StatusCodes.BAD_REQUEST
      );
    }
    return sendResponse(res, `User with email ${email} is an admin`);
  } catch (err) {
    console.error(err);
    return sendResponse(res, err, {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function signInAdmin(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, ['email', 'password']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    const { email, password } = req.body;

    // check if our db has user with that email
    const user = await User.findOne({ email: email });
    if (!user) {
      return sendResponse(
        res, `No user found with email ${email}`, {}, StatusCodes.BAD_REQUEST
      );
    }

    if (user.role !== "admin") {
      return sendResponse(
        res, `User with email ${email} not admin`, {}, StatusCodes.UNAUTHORIZED
      );
    }

    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return sendResponse(res, 'Wrong password', {}, StatusCodes.BAD_REQUEST);
    }

    // create signed token
    const token = await createSignedToken(user._id);

    // get rid of sensitive info for security
    user.password = undefined;
    user.secret = undefined;
    user.resetCode = undefined;

    // return success with token and created user object
    return sendResponse(res, 'User successfully signed in', { token, user });
  } catch (err) {
    console.error(err);
    return sendResponse(res, err, {}, StatusCodes.BAD_REQUEST);
  }
}

module.exports = { signInAdmin, userIsAdmin };
