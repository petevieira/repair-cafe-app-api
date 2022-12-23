
/**
 * Checks to make sure `obj` has the required properties
 * @param {object} object - Object with the params to check for
 * @param {array} requiredProps - Array of required properties as strings
 * @param {String} objectName - Name of object to use in 'missing' statements
 * @returns {bool|String} - true if valid, explanation string if params are missing
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
 * @param {object} req - Request data
 * @param {array} requiredParams - Array of params to check for in the request
 * @returns {bool|String} - true if valid, explanation string if params are missing
 */
function validateRequest(requestBody, requiredParams) {
  return objectHasRequiredProperties(requestBody, requiredParams, 'request');
}

module.exports = { objectHasRequiredProperties, validateRequest };
