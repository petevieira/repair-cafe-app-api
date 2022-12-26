/**
 * @file item-types-controller.js
 * @namespace item-types
 * @module item-types-controller
 * @description controller actions for itemTypes endpoints
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const ItemType = require('../models/item-type'); // import ItemType model
const { sendResponse, validateRequest } = require('../helpers/rest-helpers');

/**
 * adds an ItemType to the ItemTypes collection if the request is valid.
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
async function addItemType(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, ['name', 'imageUrl']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    // extract request body parameters
    const { name, imageUrl } = req.body;

    // check if ItemType with that name already exists in the database
    const itemTypeExists = await ItemType.findOne({ name: name });
    if (itemTypeExists) {
      return sendResponse(
        res,
        'ItemType with that name already exists: ' +
        JSON.stringify(itemTypeExists),
        {},
        StatusCodes.BAD_REQUEST);
    }

    // create and save new user document to the database
    const itemType = await new ItemType({ name, imageUrl }).save();

    // respond to client with token and user object, excluding password
    return sendResponse(res, 'ItemType added successfully', itemType);
  } catch (err) {
    console.error(err);
    return sendResponse(res, err, {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

/**
 * deletes an ItemType from the ItemTypes collection if the request is valid.
 * ItemType's ID is provided to select which ItemType to delete.
 * @function
 * @param {object} req - request object
 * @param {string} req.body.itemTypeId - _id of ItemType to delete
 * @param {object} res - response object
 * @param {object} res.body.data - response data
 * @param {object} res.body.msg - error/success message
 * @returns {object} response object
 */
async function deleteItemType(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, ['itemTypeId']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);;
  }

  const { itemTypeId } = req.body;

  try {
    await ItemType.findByIdAndDelete(itemTypeId);
    return sendResponse(
      res, 'ItemType deleted successfully', {}, StatusCodes.OK);
  } catch (err) {
    return sendResponse(res, err, {}, StatusCodes.BAD_REQUEST);
  }
}

/**
 * updates an existing ItemType if the request is valid.
 * @function
 * @param {object} req - request object
 * @param {object} req.body.updatedItemType - ItemType object with desired updated
 *   properties. it must at least contain '_id' to find the ItemType to update.
 * @param {object} res - response object
 * @param {object} res.body.data - response data
 * @param {object} res.body.data.updatedItemType - updated ItemType (on success)
 * @param {string} res.body.msg - error/success message
 * @returns {object} response object
 */
async function updateItemType(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, ['updatedItemType']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  const { updatedItemType } = req.body;

  try {
    const itemType = await ItemType.findById(updatedItemType._id);
    // make sure ItemType was found
    if (!itemType) {
      return sendResponse(res,
        `No ItemType found with id ${updatedItemType._id}`, {},
        StatusCodes.BAD_REQUEST);
    }
    // update document based on request
    itemType.name = updatedItemType.name || itemType.name;
    itemType.imageUrl = updatedItemType.imageUrl || itemType.imageUrl;
    const savedItemType = await itemType.save();
    return sendResponse(res, 'ItemType updated successfully', savedItemType);
  } catch (err) {
    return sendResponse(res, err, {}, StatusCodes.BAD_REQUEST);
  }
}

/**
 * gets all the ItemTypes in the collection after applying client's filter
 * @function
 * @param {object} req - request object. no parameters should be sent.
 * @param {object} res - response object
 * @param {object} res.body.data - response data object
 * @param {arary}  res.body.data.itemTypes -  array of ItemTypes (on success)
 * @param {string} res.body.msg - error/success message
 * @returns {object} response object
 */
async function getItemTypes(req, res) {
  let filter = {};
  if (req.body.filter !== undefined) {
    filter = req.body.filter;
  }
  try {
    const itemTypes = await ItemType.find(filter);
    return sendResponse(res, 'Retrieved item types successfully', itemTypes);
  } catch (err) {
    return sendResponse(res, err, {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = { addItemType, deleteItemType, updateItemType, getItemTypes };
