/**
 * @file root-controller.js
 * @namespace root
 * @module root-controller
 * @description controller actions for root endpoints
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const { sendResponse, validateRequest } = require('../helpers/rest-helpers'); // validator

async function home(req, res) {
  return sendResponse(res, "TRC API Health Check: Success");
}

module.exports = { home };
