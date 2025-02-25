
const { expressjwt } = require('express-jwt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { sendResponse } = require('../helpers/rest-helpers');

const requireSignin = expressjwt({
  algorithms: ['HS256'],
  secret: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE
});

const requireIsAdmin = async (req, res, next) => {
  try {
    // you get req.user._id from verified jwt token
    const user = await User.findById(req.auth._id);
    if (user.role !== "admin") {
      return sendResponse(res, 'Unauthorized', {}, StatusCodes.UNAUTHORIZED);
    } else {
      // user is an admin
      next();
    }
  } catch (err) {
    console.error(err);
  }
};

const requireIsVolunteer = async (req, res, next) => {
    try {
      // you get req.user._id from verified jwt token
      const user = await User.findById(req.auth._id);
      if (user.role !== "volunteer" && user.role !== "admin") {
        return sendResponse(res, 'Unauthorized', {}, StatusCodes.UNAUTHORIZED);
      } else {
        // user is an volunteer
        next();
      }
    } catch (err) {
      console.error(err);
    }
  };

/**
 * ExpressJS middleware to authenticate JSON web token before allowing
 * client requests through. The authorization token is a bearer token that
 * the client puts in the request header as 'Authorization Bearer <token>'
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Initial intended function
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) {
    return sendResponse(
      res, 'Missing auth token', {}, StatusCodes.UNAUTHORIZED);
  }

  try {
    const decodedPayload = await verifyClientToken(token);

    // store decoded userId in request object for next function to use
    req.userId = decodedPayload._id;
    next(); // redirect back to requested endpoint
  } catch (err) {
    console.error("error in authenticateToken(): ", err.message);
    return sendResponse(res, err.message, {}, StatusCodes.FORBIDDEN);
  }
}

/**
 * verifies the JSON web token passed from the client
 * @param {string} token - JSON web token from client
 * @returns {object} decoded payload
 */
const verifyClientToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET,
    {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    }
  );
}

module.exports = {
    requireSignin,
    requireIsAdmin,
    authenticateToken,
    verifyClientToken,
    requireIsVolunteer,
};