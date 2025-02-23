/**
 * @file items-controller.js
 * @namespace items
 * @module items-controller
 * @description controller actions for items endpoints
 */

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const Item = require('../models/item'); // import Item model
const {
    sendResponse,
    validateRequest,
    toLowerCapFirstLetter,
    extractErrorMessage
} = require('../helpers/rest-helpers');
const { emailIsSubscribed } = require('./subscribers-controller');

async function addFullItem(req, res) {
  const result = validateRequest(req.body, [
    'ownersEmail', 'ownersFirstName', 'ownersLastName', 'type', 'product',
    'symptoms', 'brand', 'model', 'repairerFirstName', 'weight',
    'repairerLastName', 'repairNotes', 'repairStatus', 'repairBarrier',
    'acceptsWaiver', 'cost', 'isFollowUpRepair',
  ]);

  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    let {
      acceptsWaiver, ownersEmail, ownersFirstName, ownersLastName, product,
      type, symptoms, brand, model, repairerFirstName, repairerLastName,
      repairNotes, repairStatus, repairBarrier, weight, cost, isFollowUpRepair,
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
      product,
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
      cost,
      isFollowUpRepair,
    }).save();

    return sendResponse(res, "Full item created", { item: item });
  } catch (error) {
    console.error(error);
  }
}

async function updateItem(req, res) {
  const result = validateRequest(req.body, [
    'ownersEmail', 'ownersFirstName', 'ownersLastName', 'type', 'product',
    'symptoms', 'brand', 'model', 'repairerFirstName', 'weight',
    'repairerLastName', 'repairNotes', 'repairStatus', 'repairBarrier',
    '_id', 'acceptsWaiver', 'cost', 'isFollowUpRepair',
  ]);

  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    let {
      _id, acceptsWaiver, ownersEmail, ownersFirstName, ownersLastName, repairNotes, product,
      type, symptoms, brand, model, repairerFirstName, repairerLastName, repairStatus,
      weight, cost, repairBarrier, isFollowUpRepair,
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
        product,
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
        cost,
        isFollowUpRepair,
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

/**
 *
 * @param {*} req - date: YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {*} res
 * @returns
 */
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
          product: 1,
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

async function findIncompleteItemsByOwner(req, res) {
    const result = validateRequest(req.params, ['email']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }
    if (req.params.email.trim() === "") {
        return sendResponse(res, "email empty", {}, StatusCodes.BAD_REQUEST);
    }

    const email = req.params.email;

    try {
        const items = await Item.find({
            ownersEmail: email,
            repairStatus: { $nin: ["Fixed", "End of Life"] }
        });
        if (items.length === 0) {
            return sendResponse(
                res,
                `No incomplete item found with owner's email ${email}`,
                {},
                StatusCodes.BAD_REQUEST
            );
        }
        return sendResponse(res, `Found ${items.length} incomplete item(s)`, { items: items });
    } catch (error) {
        console.error(error);
        return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
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
    const subscribed = await emailIsSubscribed(email);

    const item = await Item.findOne({ ownersEmail: email });
    if (!item) {
      const owner = {
        firstName: "",
        lastName: "",
        subscribedToNewsletter: subscribed,
      };
      return sendResponse(res, `No item found with owner's email ${email}`, { owner });
    }

    return sendResponse(
      res,
      `Item with owner email of ${email} found.`,
      {
        owner: {
          firstName: item.ownersFirstName,
          lastName: item.ownersLastName,
          subscribedToNewsletter: subscribed,
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
}

async function findPreviousEventDate(req, res) {
  const result = validateRequest(req.body, ['date']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  const date = req.body.date;

  try {
    const previousDate = await Item.findOne({
      createdAt: { $lt: date }
    }).sort({ createdAt: -1 });

    if (!previousDate) {
      return sendResponse(res, "No previous event date found");
    }

    return sendResponse(res, "Previous event date found", { previousDate });
  } catch (error) {
    console.error(error);
  }
}

async function findNextEventDate(req, res) {
  const result = validateRequest(req.body, ['date']);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  const date = req.body.date;

  try {
    const nextDate = await Item.findOne({
      createdAt: { $gt: date }
    }).sort({ createdAt: 1 });

    if (!nextDate) {
      return sendResponse(res, "No next event date found");
    }

    return sendResponse(res, "Next event date found", { nextDate });
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
    addFullItem,
    getItemsBasic,
    deleteItem,
    updateItem,
    getItem,
    findOwnerByEmail,
    findIncompleteItemsByOwner,
};
