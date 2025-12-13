/**
 * @file root-controller.js
 * @namespace root
 * @module root-controller
 * @description controller actions for root endpoints
 */

const { sendResponse } = require("../helpers/rest-helpers"); // validator
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

async function home(req, res) {
  const mongoReadyState = mongoose.connection.readyState;
  if (mongoReadyState !== 1) {
    return sendResponse(
      res,
      "MongoDB connection not established (readyState: " + mongoReadyState + ")",
      {},
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  return sendResponse(res, "TRC API Health Check: Running and connected to MongoDB");
}

module.exports = { home };
