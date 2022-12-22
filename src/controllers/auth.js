/**
 * @file auth.js
 * @module auth
 * @description controller actions for authentication endpoints
 * @requires jsonwebtoken
 * @requires nanoid
 */

// import package for managing JSON web tokens
const jwt = require('jsonwebtoken');
// import package for generating unique string IDs
const nanoid = require('nanoid');

// import user model
const User = require('../models/user');
// import password helpers
const { hashPassword, comparePassword } = require('../helpers/auth');

// parse .env file
require("dotenv").config();

// import and set up email sending package, SendGrid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

// constants
const PASSWORD_MIN_LENGTH = 6;
const TOKEN_EXPIRATION = '7d';

/**
 * signs user up if the request is valid.
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} response with json data
 */
exports.signUp = async (req, res) => {
  console.log("HIT SIGNUP");
  try {
    // extract request body parameters
    const { first, last, email, password } = req.body;

    // validate request data
    if (!first) {
      return res.json({ error: "First name is required" });
    }
    if (!last) {
      return res.json({ error: "Last name is required" });
    }
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    if (!password || password.length < PASSWORD_MIN_LENGTH) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }

    // check if email already exists in the database
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({ error: "Email is taken" });
    }

    console.debug("Your email is unique");

    // hash password
    const hashedPassword = await hashPassword(password);

    try {
      // save new user document to the database
      const user = await new User({
        first,
        last,
        email,
        password: hashedPassword,
      }).save();

      // create signed token
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );

      console.log(user);
      // separate password from the rest of the fields in the user document
      const { password, ...rest } = user._doc;

      // respond to client with token and user object, excluding password
      return res.json({ token, user: rest });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * signs an existing user in if the request is valid.
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} response with json data
 */
exports.signIn = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    // check if our db has user with that email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }
    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION,
    });

    user.password = undefined;
    user.secret = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

/**
 * sends user a password reset link via email
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} response with json data
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  // find user by email
  const user = await User.findOne({ email });
  console.log("USER ===> ", user);
  if (!user) {
    return res.json({ error: "User not found" });
  }
  // generate code
  const resetCode = nanoid(5).toUpperCase();
  // save to db
  user.resetCode = resetCode;
  user.save();
  // prepare email
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Password reset code",
    html: "<h1>Your password reset code is: {resetCode}</h1>"
  };
  // send email
  try {
    const data = await sgMail.send(emailData);
    console.log(data);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.json({ ok: false });
  }
};

/**
 * reset user password to one in the request
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} response with json data
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, password, resetCode } = req.body;
    // find user based on email and resetCode
    const user = await User.findOne({ email, resetCode });
    // if user not found
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    // if password is short
    if (!password || password.length < PASSWORD_MIN_LENGTH) {
      return res.json({
        error: `Password is required and should be ${PASSWORD_MIN_LENGTH}` +
          ` characters long`,
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetCode = "";
    user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};
