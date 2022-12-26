/**
 * module utils
 */

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

module.exports = { objectHasRequiredProperties, validateRequest };
