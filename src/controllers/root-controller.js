/**
 * @file root-controller.js
 * @namespace root
 * @module root-controller
 * @description controller actions for root endpoints
 */

const { sendResponse } = require('../helpers/rest-helpers'); // validator

async function home(req, res) {
    return sendResponse(res, "TRC API Health Check: Success");
}

module.exports = { home };
