
/**
 * Checks to make sure `obj` has the required properties
 */
function objectHasRequiredProperties(object, requiredProps, objectName) {
  let errorMsg = '';

  for (property in requiredProps) {
    if (!!object.property) {
      if (!empty(errorMsg)) {
        errorMsg += ' ';
      }
      errorMsg += `${property} is required but missing from ${objectName}.`
    }
  }

  return !!errorMsg ? errorMsg : true;
}

function validateRequest(req, requiredParams) {
  return objectHasRequiredProperties(req, requiredParams, 'request');
}

module.exports = { validateRequest };
