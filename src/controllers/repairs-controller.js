/**
 * @file repairs-controller.js
 * @namespace repairs
 * @module repairs-controller
 * @description controller actions for repairs endpoints
 */

const { StatusCodes } = require("http-status-codes"); // for HTTP status codes
const Repair = require("../models/repair"); // import Repair model
const {
  sendResponse,
  validateRequest,
  toLowerCapFirstLetter,
  extractErrorMessage,
} = require("../helpers/rest-helpers");
const { emailIsSubscribed } = require("./subscribers-controller");
const mongoose = require("mongoose");

async function addFullRepair(req, res) {
  const result = validateRequest(req.body, [
    "acceptsWaiver",
    "brand",
    "cost",
    "eventId",
    "isFollowUpRepair",
    "model",
    "ownersEmail",
    "ownersFirstName",
    "ownersLastName",
    "product",
    "repairerFirstName",
    "repairerLastName",
    "repairBarrier",
    "repairNotes",
    "repairStatus",
    "type",
    "symptoms",
    "weight",
  ]);

  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    let {
      acceptsWaiver,
      brand,
      cost,
      eventId,
      isFollowUpRepair,
      model,
      ownersEmail,
      ownersFirstName,
      ownersLastName,
      product,
      repairerFirstName,
      repairerLastName,
      repairBarrier,
      repairNotes,
      repairStatus,
      type,
      symptoms,
      weight,
    } = req.body;
    ownersEmail = ownersEmail.toLowerCase();
    ownersFirstName = toLowerCapFirstLetter(ownersFirstName);
    ownersLastName = toLowerCapFirstLetter(ownersLastName);
    repairerFirstName = toLowerCapFirstLetter(repairerFirstName);
    repairerLastName = toLowerCapFirstLetter(repairerLastName);

    const repair = await new Repair({
      acceptsWaiver,
      brand,
      cost,
      eventId,
      isFollowUpRepair,
      model,
      ownersEmail,
      ownersFirstName,
      ownersLastName,
      product,
      repairerFirstName,
      repairerLastName,
      repairBarrier,
      repairNotes,
      repairStatus,
      type,
      symptoms,
      weight,
    }).save();

    return sendResponse(res, "Full repair created", { repair: repair }, StatusCodes.CREATED);
  } catch (error) {
    console.error(error);
    return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function updateRepair(req, res) {
  const result = validateRequest(req.body, [
    "_id",
    "acceptsWaiver",
    "brand",
    "cost",
    "eventId",
    "isFollowUpRepair",
    "model",
    "ownersEmail",
    "ownersFirstName",
    "ownersLastName",
    "product",
    "repairerFirstName",
    "repairerLastName",
    "repairBarrier",
    "repairNotes",
    "repairStatus",
    "type",
    "symptoms",
    "weight",
  ]);

  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }

  try {
    let {
      _id,
      acceptsWaiver,
      brand,
      cost,
      eventId,
      isFollowUpRepair,
      model,
      ownersEmail,
      ownersFirstName,
      ownersLastName,
      product,
      repairerFirstName,
      repairerLastName,
      repairBarrier,
      repairNotes,
      repairStatus,
      type,
      symptoms,
      weight,
    } = req.body;
    ownersEmail = ownersEmail.toLowerCase();
    ownersFirstName = toLowerCapFirstLetter(ownersFirstName);
    ownersLastName = toLowerCapFirstLetter(ownersLastName);
    repairerFirstName = toLowerCapFirstLetter(repairerFirstName);
    repairerLastName = toLowerCapFirstLetter(repairerLastName);

    const updatedRepair = await Repair.findOneAndUpdate(
      { _id: _id },
      {
        acceptsWaiver,
        brand,
        cost,
        eventId,
        isFollowUpRepair,
        model,
        ownersEmail,
        ownersFirstName,
        ownersLastName,
        product,
        repairerFirstName,
        repairerLastName,
        repairBarrier,
        repairNotes,
        repairStatus,
        type,
        symptoms,
        weight,
      },
      { new: true }
    );
    if (!updatedRepair) {
      return sendResponse(res, "Repair not found", {}, StatusCodes.BAD_REQUEST);
    }
    return sendResponse(res, `Repair updated`, { repair: updatedRepair });
  } catch (error) {
    console.error(error);
    return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getRepair(req, res) {
  const result = validateRequest(req.params, ["id"]);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }
  if (req.params.id.trim() === "") {
    return sendResponse(res, "id empty", {}, StatusCodes.BAD_REQUEST);
  }

  const id = req.params.id;

  try {
    const repair = await Repair.findById(id);
    if (!repair) {
      return sendResponse(res, `No repair found with id ${id}`, {}, StatusCodes.BAD_REQUEST);
    }
    return sendResponse(res, `Repair with id ${id} found`, { repair: repair });
  } catch (error) {
    console.error(error);
    return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

/**
 *
 * @param {*} req - date: YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {*} res
 * @returns
 */
async function getRepairsBasic(req, res) {
  const result = validateRequest(req.params, ["eventId"]);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }
  const eventId = req.params.eventId;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return sendResponse(res, "Invalid eventId", {}, StatusCodes.BAD_REQUEST);
  }

  try {
    const repairs = await Repair.aggregate([
      {
        $match: {
          eventId: mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $project: {
          _id: 1,
          ownersFirstName: 1,
          ownersLastName: {
            $ifNull: [{ $concat: [{ $toUpper: { $substrCP: ["$ownersLastName", 0, 1] } }, "."] }, ""],
          },
          product: 1,
          repairerFirstName: 1,
          repairerLastName: {
            $ifNull: [{ $concat: [{ $toUpper: { $substrCP: ["$repairerLastName", 0, 1] } }, "."] }, ""],
          },
          repairStatus: 1,
          isFollowUpRepair: 1,
          createdAt: 1,
        },
      },
    ]);
    return sendResponse(res, `Found ${repairs.length} repairs(s)`, { repairs });
  } catch (error) {
    console.error(error);
    return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function findIncompleteRepairsByOwner(req, res) {
  const result = validateRequest(req.params, ["email"]);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }
  if (req.params.email.trim() === "") {
    return sendResponse(res, "email empty", {}, StatusCodes.BAD_REQUEST);
  }

  const email = req.params.email;

  try {
    const repairs = await Repair.find({
      ownersEmail: email,
      repairStatus: { $nin: ["Fixed", "End of Life"] },
    }).sort({ createdAt: 1 });

    if (repairs.length === 0) {
      return sendResponse(res, `No incomplete repairs found with owner's email ${email}`, { repairs: null });
    }
    if (repairs.length === 1) {
      return sendResponse(res, `Found 1 incomplete repair`, { repairs: repairs });
    } else {
      return sendResponse(res, `Found ${repairs.length} incomplete repairs`, { repairs: repairs });
    }
  } catch (error) {
    console.error(error);
    return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function deleteRepair(req, res) {
  console.log("deleteRepair", req.params);
  // Check for required request params
  const result = validateRequest(req.params, ["id"]);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }
  if (req.params.id.trim() === "") {
    return sendResponse(res, "id empty", {}, StatusCodes.BAD_REQUEST);
  }

  const { id } = req.params;

  try {
    const repair = await Repair.deleteOne({ _id: id });
    const msg = repair.deletedCount > 0 ? `Repair ${id} deleted` : "Repair not found";
    return sendResponse(res, msg, repair);
  } catch (err) {
    console.error(err);
    return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function findOwnerByEmail(req, res) {
  const result = validateRequest(req.params, ["email"]);
  if (result !== true) {
    return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
  }
  if (req.params.email.trim() === "") {
    return sendResponse(res, "email empty", {}, StatusCodes.BAD_REQUEST);
  }

  const email = req.params.email;

  try {
    const subscribed = await emailIsSubscribed(email);

    const repair = await Repair.findOne({ ownersEmail: email });
    if (!repair) {
      const owner = {
        firstName: "",
        lastName: "",
        subscribedToNewsletter: subscribed,
      };
      return sendResponse(res, `No repair found with owner's email ${email}`, { owner });
    }

    return sendResponse(res, `Repair with owner email of ${email} found.`, {
      owner: {
        firstName: repair.ownersFirstName,
        lastName: repair.ownersLastName,
        subscribedToNewsletter: subscribed,
      },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, extractErrorMessage(error), {}, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  addFullRepair,
  getRepairsBasic,
  deleteRepair,
  updateRepair,
  getRepair,
  findOwnerByEmail,
  findIncompleteRepairsByOwner,
};
