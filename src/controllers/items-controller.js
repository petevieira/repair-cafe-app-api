/**
 * @file items-controller.js
 * @namespace items
 * @module items-controller
 * @description controller actions for items endpoints
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const Item = require('../models/items'); // import Item model
const { sendResponse, validateRequest } = require('../helpers/rest-helpers');

/**
 * adds an Item to the Item collection if the request is valid.
 * @function
 * @param {object} req - request object
 * @param {string} req.body.name - name of ItemType
 * @param {string} req.body.imageUrl - URL of ItemType image
 * @param {object} res - response object
 * @param {object} res.body.data - response object
 * @param {object} res.body.data.itemType - ItemType that was added
 * @param {string} res.body.msg - error/success message
 * @returns {object} response object
 */
async function addItem(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, [
    'type', "symptoms", "ownerId"
  ]);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }
