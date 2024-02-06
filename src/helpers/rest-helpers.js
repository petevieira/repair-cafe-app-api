/**
 * module utils
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes

/**
 * sends response to client with message, data, and status code.
 * purpose is to have consistent response object for client.
 * all API responses should call this function to send their response.
 * @param {object} response - ExpressJS response object
 * @param {string} msg - response message (success or error)
 * @param {object} data - response data
 * @param {number} statusCode - HTTP status code to return
 * @returns {object} response - { status, body: { msg, data } }
 */
function sendResponse(response, msg='', data={}, statusCode=StatusCodes.OK) {
  // Make sure response is valid before using it
  if (!response) {
    throw new Error('sendResponse(): response object invalid');
  }

  const status = (statusCode >= 200 && statusCode < 300);
  return response
    .status(statusCode)
    .json({ status: status, msg: msg, data: data });
}

/**
 * checks to make sure `obj` has the required properties
 * @param {object} object - object with the params to check for
 * @param {array} requiredProps - array of required properties as strings
 * @param {string} objectName - name of object to use in error message
 * @returns {bool} - true if valid
 * @returns {string} - explanation string if params are missing
 */
function objectHasRequiredProperties(object, requiredProps, objectName) {
  let errorMsg = '';

  requiredProps.forEach(prop => {
    if (object[prop] === undefined) {
      if (errorMsg !== '') {
        errorMsg += ' ';
      }
      errorMsg += `${prop} is required but missing from ${objectName}.`
    }
  });

  return errorMsg === '' ? true : errorMsg;
}

/**
 * Verifies that the request object has the required parameters
 * @param {object} requestBody - request data
 * @param {array} requiredParams - array of params to check for in the request
 * @returns {bool} - true if valid
 * @returns {string} - error string if invalid
 */
function validateRequest(requestBody, requiredParams) {
  return objectHasRequiredProperties(requestBody, requiredParams, 'request');
}

function toLowerCapFirstLetter(str) {
  let newStr = str.toLowerCase();
  return (newStr.charAt(0).toUpperCase() + newStr.slice(1));
}

module.exports = { sendResponse, objectHasRequiredProperties, validateRequest, toLowerCapFirstLetter };
