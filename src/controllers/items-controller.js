/**
 * @file items-controller.js
 * @namespace items
 * @module items-controller
 * @description controller actions for items endpoints
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const Item = require('../models/item'); // import Item model
const { sendResponse, validateRequest, toLowerCapFirstLetter } = require('../helpers/rest-helpers');

async function addFullItem(req, res) {
  const result = validateRequest(req.body, [
    'ownersEmail', 'ownersFirstName', 'ownersLastName', 'type',
    'symptoms', 'brand', 'model', 'repairerFirstName', 'weight',
    'repairerLastName', 'repairNotes', 'repairStatus', 'repairBarrier',
    'acceptsWaiver', 'cost'
  ]);

  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    let {
      acceptsWaiver, ownersEmail, ownersFirstName, ownersLastName,
      type, symptoms, brand, model, repairerFirstName, repairerLastName,
      repairNotes, repairStatus, repairBarrier, weight, cost
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
      repairNotes,
      repairStatus,
      repairBarrier,
      weight,
      cost
    }).save();

    return sendResponse(res, "Full item created", { item: item });
  } catch (error) {
    console.error(error);
  }
}

async function updateItem(req, res) {
  const result = validateRequest(req.body, [
    'ownersEmail', 'ownersFirstName', 'ownersLastName', 'type',
    'symptoms', 'brand', 'model', 'repairerFirstName', 'weight',
    'repairerLastName', 'repairNotes', 'repairStatus', 'repairBarrier',
    '_id', 'acceptsWaiver', 'cost'
  ]);

  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    let {
      _id, acceptsWaiver, ownersEmail, ownersFirstName, ownersLastName, repairNotes,
      type, symptoms, brand, model, repairerFirstName, repairerLastName, repairStatus,
      weight, cost, repairBarrier
    } = req.body;
    ownersEmail = ownersEmail.toLowerCase();
    ownersFirstName = toLowerCapFirstLetter(ownersFirstName);
    ownersLastName = toLowerCapFirstLetter(ownersLastName);
    repairerFirstName = toLowerCapFirstLetter(repairerFirstName);
    repairerLastName = toLowerCapFirstLetter(repairerLastName);

    const originalItem = await Item.findOneAndUpdate(
      { _id: _id },
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
        repairNotes,
        repairStatus,
        repairBarrier,
        weight,
        cost
      }
    );
    const updatedItem = await Item.findById(_id);
    return sendResponse(res, `Item (${_id}) updated`, { item: updatedItem });
  } catch (error) {
    console.error(error);
  }
}

async function getItem(req, res) {
  const result = validateRequest(req.params, ['id']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }
  if (req.params.id.trim() === "") {
    return sendResponse(res, "id empty", {}, StatusCodes.BAD_REQUEST);
  }

  const id = req.params.id;

  try {
    const item = await Item.findById(id);
    if (!item) {
      return sendResponse(
        res, `No item found with id ${id}`, {}, StatusCodes.BAD_REQUEST
      );
    }
    return sendResponse(res, `Item with id ${id} found`, { item: item });
  } catch (error) {
    console.error(error);
  }
}

async function getItemsBasic(req, res) {
  const result = validateRequest(req.params, ['date']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  const date = new Date(req.params.date);
  let datePlus24h = new Date(req.params.date);
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
          repairStatus: 1
        }
      }
    ]);
    return sendResponse(res, `Found ${items.length} item(s)`, { items: items });
  } catch (error) {
    console.error(error);
  }
}

async function deleteItem(req, res) {
  // Check for required request params
  const result = validateRequest(req.params, ['id']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }
  if (req.params.id.trim() === "") {
    return sendResponse(res, "id empty", {}, StatusCodes.BAD_REQUEST);
  }

  const { id } = req.params;

  try {
    const item = await Item.deleteOne({ _id: id });
    const msg = item.deletedCount > 0 ? `Item ${id} deleted` : "Item not found";
    return sendResponse(res, msg, item);
   } catch (err) {
    console.error(err);
    return sendResponse(res, err, {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function findOwnerByEmail(req, res) {
  const result = validateRequest(req.params, ['email']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }
  if (req.params.email.trim() === "") {
    return sendResponse(res, "email empty", {}, StatusCodes.BAD_REQUEST);
  }

  const email = req.params.email;

  try {
    const item = await Item.findOne({ ownersEmail: email });
    if (!item) {
      return sendResponse(
        res,
        `No item found with owner's email ${email}`,
      );
    }
    return sendResponse(
      res,
      `Item with owner email of ${email} found.`,
      {
        owner: {
          firstName: item.ownersFirstName,
          lastName: item.ownersLastName
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  addFullItem, getItemsBasic, deleteItem, updateItem, getItem, findOwnerByEmail
};
