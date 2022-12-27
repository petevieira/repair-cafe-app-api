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
const Auth = require('../helpers/auth-helpers'); // password helpers
const { sendResponse, validateRequest } = require('../helpers/rest-helpers'); // validator
require("dotenv").config(); // parse .env file
const sgMail = require("@sendgrid/mail"); // for sending emails

// configure SendGrid email API
sgMail.setApiKey(process.env.SENDGRID_KEY);

/**
 * signs user up if the request is valid.
 * @function
 * @param {object} req - request object
 * @param {string} req.body.first - first name of user
 * @param {string} req.body.last - last name of user
 * @param {string} req.body.email - email of user
 * @param {string} req.body.password - password of user
 * @param {object} res - response object
 * @returns {object} response with User object that was created
 *   or an error
 */
async function signUp(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, [
    'first', 'last', 'email', 'password'
  ]);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    // extract request body parameters
    const { first, last, email, password } = req.body;

    // check if email already exists in the database
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return sendResponse(res, 'Email is taken', {}, StatusCodes.BAD_REQUEST);
    }

    // hash password
    const hashedPassword = await Auth.hashPassword(password);

    // create and save new user document to the database
    const user = await new User({
      first,
      last,
      email,
      password: hashedPassword,
      roles: ['user']
    }).save();

    // create signed token
    const token = await Auth.createSignedToken(user._id);

    // separate password from the rest of the fields in the user document
    const { pwd, ...rest } = user._doc;

    // respond to client with token and user object, excluding password
    return sendResponse(
      res, 'User successfully signed up', { token, user: rest });
  } catch (err) {
    console.error(err);
    return sendResponse(res, err, {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

/**
 * signs an existing user in if the request is valid.
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} response with json data
 */
async function signIn(req, res) {
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
      return sendResponse(res, 'No user found', {}, StatusCodes.BAD_REQUEST);
    }

    // check password
    const match = await Auth.comparePassword(password, user.password);
    if (!match) {
      return sendResponse(res, 'Wrong password', {}, StatusCodes.BAD_REQUEST);
    }

    // create signed token
    const token = await Auth.createSignedToken(user._id);

    // get rid of sensitive info for security
    user.password = undefined;
    user.secret = undefined;

    // return success with token and created user object
    return sendResponse(res, 'User successfully signed in', { token, user });
  } catch (err) {
    console.error(err);
    return sendResponse(res, err, {}, StatusCodes.BAD_REQUEST);
  }
}

/**
 * sends user a password reset link via email
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} response with json data
 */
async function forgotPassword(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, ['email']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  // extract params from request body
  const { email } = req.body;

  // find user by email
  let user = await User.findOne({ email: email });
  if (!user) {
    return sendResponse(
      res, "User with that email not found", {}, StatusCodes.BAD_REQUEST);
  }

  // generate password reset code and save it to the database
  user.resetCode = nanoid(5).toUpperCase();
  user.save();

  // prepare email
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Password reset code",
    html: `<h1>Your password reset code is: ${user.resetCode}</h1>`,
    mail_settings: {
      sandbox_mode: {
        enable: process.env.NODE_ENV === 'test'
      }
    }
  };

  // send email
  try {
    const data = await sgMail.send(emailData);
    return sendResponse(res, 'Password reset email successfully sent');
  } catch (err) {
    console.error(err);
    return sendResponse(
      res, `Failed to send email. $err`, {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

/**
 * reset user password to one in the request
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} response with json data
 */
async function resetPassword(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, ['email', 'resetCode', 'newPassword']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    const { email, resetCode, newPassword } = req.body;
    // find user based on email and resetCode
    const user = await User.findOne({ email: email, resetCode: resetCode });
    // if user not found
    if (!user) {
      return sendResponse(
        res, 'Email or reset code is invalid', {}, StatusCodes.BAD_REQUEST);
    }
    // if password is short
    if (!newPassword || newPassword.length < process.env.PASSWORD_MIN_LENGTH) {
      return sendResponse(
        res,
        `Password is required and should be ` +
          `${process.env.PASSWORD_MIN_LENGTH} characters long`,
        {},
        StatusCodes.BAD_REQUEST);
    }
    // hash password
    const hashedPassword = await Auth.hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetCode = "";
    user.save();
    return sendResponse(res, 'Password successfully reset');
  } catch (err) {
    console.error(err);
    return sendResponse(res, err, {}, StatusCodes.BAD_REQUEST);
  }
}

module.exports = { signUp, signIn, forgotPassword, resetPassword };
