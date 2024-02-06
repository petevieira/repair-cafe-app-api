/**
 * @file texts-controller.js
 * @namespace texts
 * @module texts-controller
 * @description controller actions for texts endpoints
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const Text = require('../models/text'); // import model
const { sendResponse, validateRequest } = require('../helpers/rest-helpers');

const getText = async (req, res) => {
  const result = validateRequest(req.params, ['field']);

  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }
  const field = req.params.field;

  try {
    const text = await Text.findOne({ name: field });

    if (!text) {
      return sendResponse(
        res, `Text with name ${field} not found`, {}, StatusCodes.BAD_REQUEST
      );
    }

    return sendResponse(res, `${field} text retrieved`, { text: text });
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getText };
