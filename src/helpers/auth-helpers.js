/**
 * @namespace auth
 * @module auth-helpers
 * @requires bcrypt
 * @requires jsonwebtoken
 */

const bcrypt = require('bcrypt'); // for hashing user passwords
const jwt = require('jsonwebtoken'); // for JSON Web Token helpers
const { sendResponse } = require('../helpers/rest-helpers'); // validator
const { StatusCodes } = require('http-status-codes'); // for HTTP status codes

class Auth {

/**
 * created a signed JSON Web Token
 * @param {string} id - ID of user
 * @returns {object} JSON Web Token that was created
 */
static createSignedToken = function(userId) {
  return jwt.sign(
    { _id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRATION,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    });
}

/**
 * verifies the JSON web token passed from the client
 * @param {string} token - JSON web token from client
 * @returns {object} decoded payload
 */
static verifyClientToken = function(token) {
  return jwt.verify(
    token,
    process.env.JWT_SECRET,
    {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    });
}

/**
 * ExpressJS middleware to authenticate JSON web token before allowing
 * client requests through. The authorization token is a bearer token that
 * the client puts in the request header as 'Authorization Bearer <token>'
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Initial intended function
 */
static authenticateToken = async function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) {
    return sendResponse(
      res, 'Missing auth token', {}, StatusCodes.UNAUTHORIZED);
  }

  try {
    const decodedPayload = await Auth.verifyClientToken(token);
    // store decoded userId in request object for next function to use
    req.userId = decodedPayload._id;
    next(); // redirect back to requested endpoint
  } catch (err) {
    console.error("authicateToken() error: ", err.message);
    return sendResponse(res, err.message, {}, StatusCodes.FORBIDDEN);
  }
}

/**
 * hashes user password
 * @param {string} password - user password, unhashed
 * @returns {Promise} promise gives hashed password, otherwise error object
 */
static hashPassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
}

/**
 * compares password against a hashed password
 * @param {string} password - password to compare
 * @param {string} hashed - hashed password to compare password to
 * @returns {bool} true if the same, false if different
 */
static comparePassword = function(password, hashed) {
  return bcrypt.compare(password, hashed);
}
}
module.exports = Auth;
