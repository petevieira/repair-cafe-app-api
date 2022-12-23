/**
 * @file auth.js
 * @module auth
 * @description controller actions for authentication endpoints
 * @requires jsonwebtoken
 * @requires nanoid
 */

const nanoid = require('nanoid'); // to generate unique reset code
const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const User = require('../models/user'); // import User model
const {
  hashPassword,
  comparePassword,
  createSignedJwtToken } = require('../helpers/auth-helper'); // password helpers
const { validateRequest } = require('../helpers/request-helper'); // validator
require("dotenv").config(); // parse .env file
const sgMail = require("@sendgrid/mail"); // for sending emails

// configure SendGrid email API
sgMail.setApiKey(process.env.SENDGRID_KEY);

// constants
const PASSWORD_MIN_LENGTH = 6;
const TOKEN_EXPIRATION = '7d';

/**
 * signs user up if the request is valid.
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} response with User object that was created
 *   or an error
 */
async function signUp(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, ['first', 'last', 'email', 'password']);
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
    return res.status(StatusCodes.BAD_REQUEST).json({ error: result });
  }

  try {
    const { email, password } = req.body;

    // check if our db has user with that email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No user found" });
    }

    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Wrong password" });
    }

    // create signed token
    const token = createSignedJwtToken(
      user._id, process.env.JWT_SECRET, TOKEN_EXPIRATION);

    // get rid of sensitive info for security
    user.password = undefined;
    user.secret = undefined;

    // return success with token and created user object
    return res.json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err });
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
    return res.status(StatusCodes.BAD_REQUEST).json({ error: result });
  }

  // extract params from request body
  const { email } = req.body;

  // find user by email
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST)
      .json({ error: "User with that email not found" });
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
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ ok: false, error: 'Failed to send email' });
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
    return res.status(StatusCodes.BAD_REQUEST).json({ error: result });
  }

  try {
    const { email, resetCode, newPassword } = req.body;
    // find user based on email and resetCode
    const user = await User.findOne({ email: email, resetCode: resetCode });
    // if user not found
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST)
        .json({ error: "Email or reset code is invalid" });
    }
    // if password is short
    if (!newPassword || newPassword.length < PASSWORD_MIN_LENGTH) {
      return res.status(StatusCodes.BAD_REQUEST)
        .json({ error: `Password is required and should be ` +
          `${PASSWORD_MIN_LENGTH} characters long`});
    }
    // hash password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetCode = "";
    user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err });
  }
}

module.exports = { signUp, signIn, forgotPassword, resetPassword };
