/**
 * @file items-controller.js
 * @namespace items
 * @module items-controller
 * @description controller actions for items endpoints
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const Item = require('../models/item'); // import Item model
const { sendResponse, validateRequest, toLowerCapFirstLetter } = require('../helpers/rest-helpers');

async function addBasicItem(req, res) {
	const result = validateRequest(req.body, [
    'ownersEmail', 'ownersFirstName', 'ownersLastName',
    'type', 'symptoms', 'brand', 'model'
  ]);

  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    let {
      ownersEmail, ownersFirstName, ownersLastName,
      type, symptoms, brand, model
    } = req.body;

    ownersEmail = ownersEmail.toLowerCase();
    ownersFirstName = toLowerCapFirstLetter(ownersFirstName);
    ownersLastName = toLowerCapFirstLetter(ownersLastName);

    const item = await new Item({
      ownersEmail,
      ownersFirstName,
      ownersLastName,
      type,
      symptoms,
      brand,
      model
    }).save();

    return sendResponse(res, "Basic item created", { item: item });
  } catch (error) {
    console.error(error);
  }
}

async function addFullItem(req, res) {
  const result = validateRequest(req.body, [
    'ownersEmail', 'ownersFirstName', 'ownersLastName', 'type',
    'symptoms', 'brand', 'model', 'repairerFirstName',
    'repairerLastName', 'notes', 'status'
  ]);

  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    let {
      acceptsWaiver, ownersEmail, ownersFirstName, ownersLastName,
      type, symptoms, brand, model, repairerFirstName, repairerLastName, notes, status
    } = req.body;
    ownersEmail = ownersEmail.toLowerCase();
    ownersFirstName = toLowerCapFirstLetter(ownersFirstName);
    ownersLastName = toLowerCapFirstLetter(ownersLastName);
    repairerFirstName = toLowerCapFirstLetter(repairerFirstName);
    repairerLastName = toLowerCapFirstLetter(repairerLastName);

    const item = await new Item({
      acceptsWaiver,
      ownersEmail,
      ownersFirstName,
      ownersLastName,
      type,
      symptoms,
      brand,
      model,
      repairerFirstName,
      repairerLastName,
      notes,
      status
    }).save();

    return sendResponse(res, "Full item created", { item: item });
  } catch (error) {
    console.error(error);
  }
}

async function updateItem(req, res) {
  const result = validateRequest(req.body, [
    'ownersEmail', 'ownersFirstName', 'ownersLastName', 'type',
    'symptoms', 'brand', 'model', 'repairerFirstName',
    'repairerLastName', 'notes', 'status', 'id'
  ]);

  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    let {
      id, acceptsWaiver, ownersEmail, ownersFirstName, ownersLastName,
      type, symptoms, brand, model, repairerFirstName, repairerLastName, notes, status
    } = req.body;
    ownersEmail = ownersEmail.toLowerCase();
    ownersFirstName = toLowerCapFirstLetter(ownersFirstName);
    ownersLastName = toLowerCapFirstLetter(ownersLastName);
    repairerFirstName = toLowerCapFirstLetter(repairerFirstName);
    repairerLastName = toLowerCapFirstLetter(repairerLastName);

    const item = await Item.findOneAndUpdate(
      { _id: id },
      {
        acceptsWaiver,
        ownersEmail,
        ownersFirstName,
        ownersLastName,
        type,
        symptoms,
        brand,
        model,
        repairerFirstName,
        repairerLastName,
        notes,
        status
      }
    );

    return sendResponse(res, `Item (${id}) updated`, { item: item });
  } catch (error) {
    console.error(error);
  }
}

async function getItemsBasic(req, res) {
  const result = validateRequest(req.body, ['date']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  const date = new Date(req.body.date);
  let datePlus24h = new Date(req.body.date);
  datePlus24h.setDate(date.getDate() + 1);

  try {
    const items = await Item.aggregate([
      {
        $match: {
          createdAt: {
            $gte: date,
            $lt: datePlus24h
          }
        }
      },
      {
        $project: {
          _id: 1,
          ownersFirstName: 1,
          ownersLastName: {
            $ifNull: [
              { $concat: [{ $toUpper: { $substrCP: ['$ownersLastName', 0, 1] } }, '.'] },
              ''
            ]
          },
          type: 1,
          repairerFirstName: 1,
          repairerLastName: {
            $ifNull: [
              { $concat: [{ $toUpper: { $substrCP: ['$repairerLastName', 0, 1] } }, '.'] },
              ''
            ]
          },
          status: 1
        }
      }
    ]);
    console.debug("items: ", items);
    return sendResponse(res, `Found ${items.length} item(s)`, items);
  } catch (error) {
    console.error(error);
    return sendResponse(
      res, "Internal server error", {}, StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function deleteItem(req, res) {
  // Check for required request params
  const result = validateRequest(req.body, ['id']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }
  if (req.body.id.trim() === "") {
    return sendResponse(res, "id empty", {}, StatusCodes.BAD_REQUEST);
  }

  const { id } = req.body;
  const initialDocCount = await Item.countDocuments({ _id: id});

  try {
    const item = await Item.deleteOne({ _id: id });
    const finalDocCount = await Item.countDocuments({ _id: id});
    console.debug(`Count: ${initialDocCount} -> ${finalDocCount}`);
    return sendResponse(res, `Deleted item ${id}`, item);
  } catch (err) {
    console.error(err);
    return sendResponse(res, err, {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = { addBasicItem, addFullItem, getItemsBasic, deleteItem, updateItem };
