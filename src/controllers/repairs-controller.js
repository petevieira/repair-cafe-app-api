/**
 * @file repairs-controller.js
 * @namespace repairs
 * @module repairs-controller
 * @description controller actions for repairs endpoints
 */

const { StatusCodes } = require("http-status-codes"); // for HTTP status codes
const Repair = require("../models/repair"); // import Repair model
const RepairEvent = require("../models/repair-event"); // import RepairEvent model (for stats)
const Volunteer = require("../models/volunteer"); // import Volunteer model (for stats)
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
    "previousRepairer",
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
      previousRepairer,
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
      previousRepairer,
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
    "previousRepairer",
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
      previousRepairer,
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
        previousRepairer,
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

/**
 * Compute aggregate repair statistics for the data dashboard.
 * Returns all-time totals plus a per-year breakdown. Money saved and weight
 * diverted are provided for two outcome scopes so the client can toggle
 * between "Fixed only" and "Fixed + Repairable".
 * Status matching is case-insensitive so mixed casing (e.g. "End of life"
 * vs "End of Life") is bucketed together.
 */
async function getRepairStats(req, res) {
  // Round to 2 decimals for money/weight totals (avoids long floating point tails).
  const round2 = (n) => Math.round((n || 0) * 100) / 100;
  // Round to 1 decimal for per-event averages.
  const round1 = (n) => Math.round((n || 0) * 10) / 10;

  // Accumulators shared by the per-year and all-time groupings. Each metric is
  // computed in a single pass using $cond to conditionally count/sum only the
  // documents matching a given status. `statusLower`, `costNum`, and `weightNum`
  // are precomputed fields added in the $addFields stage below.
  const metricAccumulators = {
    // Every repair in the bucket, regardless of status.
    totalIntake: { $sum: 1 },
    // Counts per outcome status (1 when the status matches, else 0).
    fixedCount: { $sum: { $cond: [{ $eq: ["$statusLower", "fixed"] }, 1, 0] } },
    repairableCount: { $sum: { $cond: [{ $eq: ["$statusLower", "repairable"] }, 1, 0] } },
    endOfLifeCount: { $sum: { $cond: [{ $eq: ["$statusLower", "end of life"] }, 1, 0] } },
    unknownCount: { $sum: { $cond: [{ $eq: ["$statusLower", "unknown"] }, 1, 0] } },
    inQueueCount: { $sum: { $cond: [{ $eq: ["$statusLower", "in queue"] }, 1, 0] } },
    inProgressCount: { $sum: { $cond: [{ $eq: ["$statusLower", "in progress"] }, 1, 0] } },
    // Money saved / weight diverted, "Fixed only" scope: sum the numeric value
    // only for Fixed items, contribute 0 otherwise.
    fixedMoney: { $sum: { $cond: [{ $eq: ["$statusLower", "fixed"] }, "$costNum", 0] } },
    fixedWeight: { $sum: { $cond: [{ $eq: ["$statusLower", "fixed"] }, "$weightNum", 0] } },
    // Same totals for the "Fixed + Repairable" scope so the client can toggle
    // between scopes without another request.
    fixedRepairableMoney: {
      $sum: { $cond: [{ $in: ["$statusLower", ["fixed", "repairable"]] }, "$costNum", 0] },
    },
    fixedRepairableWeight: {
      $sum: { $cond: [{ $in: ["$statusLower", ["fixed", "repairable"]] }, "$weightNum", 0] },
    },
  };

  // Convert a raw $group result row into the API's bucket shape. `row` is null
  // when a bucket has no matching documents (e.g. all-time with an empty DB),
  // in which case every metric defaults to 0. `topCategories` is filled in later.
  const shapeBucket = (row, year) => ({
    year: year,
    totalIntake: row ? row.totalIntake : 0,
    counts: {
      fixed: row ? row.fixedCount : 0,
      repairable: row ? row.repairableCount : 0,
      endOfLife: row ? row.endOfLifeCount : 0,
      unknown: row ? row.unknownCount : 0,
      inQueue: row ? row.inQueueCount : 0,
      inProgress: row ? row.inProgressCount : 0,
    },
    moneySaved: {
      fixed: round2(row ? row.fixedMoney : 0),
      fixedPlusRepairable: round2(row ? row.fixedRepairableMoney : 0),
    },
    weightDiverted: {
      fixed: round2(row ? row.fixedWeight : 0),
      fixedPlusRepairable: round2(row ? row.fixedRepairableWeight : 0),
    },
    topCategories: [],
    // Event/volunteer metrics are filled in after the events and volunteers
    // aggregations run (see enrichWithEventStats below).
    events: 0,
    volunteers: 0,
    avgVolunteersPerEvent: 0,
    maxItemsAtEvent: 0,
    avgItemsPerEvent: 0,
  });

  try {
    const facetResult = await Repair.aggregate([
      {
        // Normalize each document before grouping:
        // - statusLower: lowercased status so mixed casing ("End of life" vs
        //   "End of Life") is matched consistently. $ifNull guards missing status.
        // - costNum/weightNum: coerce to double so stray strings or nulls become 0
        //   instead of breaking the $sum.
        // - year: calendar year (UTC) extracted from createdAt for per-year buckets.
        $addFields: {
          statusLower: { $toLower: { $ifNull: ["$repairStatus", ""] } },
          costNum: { $convert: { input: "$cost", to: "double", onError: 0, onNull: 0 } },
          weightNum: { $convert: { input: "$weight", to: "double", onError: 0, onNull: 0 } },
          year: { $year: "$createdAt" },
        },
      },
      {
        // $facet runs several independent sub-pipelines over the same input in
        // one query, so we get per-year metrics, all-time metrics, and the
        // top-category rankings without multiple round trips to the DB.
        $facet: {
          // Metrics grouped by year, oldest first.
          byYear: [{ $group: { _id: "$year", ...metricAccumulators } }, { $sort: { _id: 1 } }],
          // Same metrics with a single group (_id: null) covering all documents.
          allTime: [{ $group: { _id: null, ...metricAccumulators } }],
          // Top categories per year: count items per (year, category), sort by
          // count within each year, regroup into one doc per year, then keep the
          // top 8. The $sort before the second $group is what makes $slice return
          // the highest-count categories.
          topCategoriesByYear: [
            { $match: { type: { $nin: [null, ""] } } },
            { $group: { _id: { year: "$year", category: "$type" }, count: { $sum: 1 } } },
            { $sort: { "_id.year": 1, count: -1 } },
            {
              $group: {
                _id: "$_id.year",
                categories: { $push: { category: "$_id.category", count: "$count" } },
              },
            },
            { $project: { categories: { $slice: ["$categories", 8] } } },
          ],
          // Top 8 categories across all years combined.
          topCategoriesAllTime: [
            { $match: { type: { $nin: [null, ""] } } },
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 },
          ],
          // Items-per-event, per year: first count repairs per event (carrying
          // the event's year), then reduce to the busiest event (maxItems) for
          // each year.
          itemsPerEventByYear: [
            { $group: { _id: "$eventId", count: { $sum: 1 }, year: { $first: "$year" } } },
            { $group: { _id: "$year", maxItems: { $max: "$count" } } },
          ],
          // Busiest single event across all years.
          itemsPerEventAllTime: [
            { $group: { _id: "$eventId", count: { $sum: 1 } } },
            { $group: { _id: null, maxItems: { $max: "$count" } } },
          ],
        },
      },
    ]);

    // $facet always returns a single-element array holding the branches.
    const facet = facetResult[0] || {};

    // Event and volunteer counts live in other collections, so aggregate them
    // separately. Events are bucketed by their scheduled date; volunteers by
    // when the signup record was created (which is at the event).
    const eventsAgg = await RepairEvent.aggregate([
      { $addFields: { year: { $year: "$date" } } },
      {
        $facet: {
          byYear: [{ $group: { _id: "$year", count: { $sum: 1 } } }],
          allTime: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ]);
    const volunteersAgg = await Volunteer.aggregate([
      { $addFields: { year: { $year: "$createdAt" } } },
      {
        $facet: {
          byYear: [{ $group: { _id: "$year", count: { $sum: 1 } } }],
          allTime: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ]);

    // Turn a facet's byYear array into a { year: value } lookup and pull the
    // single all-time total. `field` is the accumulator name to read.
    const toYearMap = (branch, field) => {
      const map = {};
      (branch || []).forEach((row) => {
        if (row._id !== null && row._id !== undefined) {
          map[row._id] = row[field];
        }
      });
      return map;
    };
    const allTimeValue = (branch, field) => {
      const row = (branch || [])[0];
      return row ? row[field] : 0;
    };

    const eventsFacet = eventsAgg[0] || {};
    const volunteersFacet = volunteersAgg[0] || {};
    const eventsByYear = toYearMap(eventsFacet.byYear, "count");
    const volunteersByYear = toYearMap(volunteersFacet.byYear, "count");
    const maxItemsByYear = toYearMap(facet.itemsPerEventByYear, "maxItems");
    const eventsAllTime = allTimeValue(eventsFacet.allTime, "count");
    const volunteersAllTime = allTimeValue(volunteersFacet.allTime, "count");
    const maxItemsAllTime = allTimeValue(facet.itemsPerEventAllTime, "maxItems");

    // Attach event/volunteer metrics to an already-shaped repairs bucket.
    // Averages use the event count as the denominator (0 when no events).
    const enrichWithEventStats = (bucket, events, volunteers, maxItems) => {
      bucket.events = events || 0;
      bucket.volunteers = volunteers || 0;
      bucket.avgVolunteersPerEvent = events > 0 ? round1(volunteers / events) : 0;
      bucket.maxItemsAtEvent = maxItems || 0;
      bucket.avgItemsPerEvent = events > 0 ? round1(bucket.totalIntake / events) : 0;
      return bucket;
    };

    // Index the per-year top categories by year for quick lookup when merging
    // them into the byYear buckets below.
    const topByYear = {};
    (facet.topCategoriesByYear || []).forEach((entry) => {
      topByYear[entry._id] = (entry.categories || []).map((c) => ({
        category: c.category,
        count: c.count,
      }));
    });

    // Build the per-year buckets. Documents without a createdAt produce a null
    // year from $year, so we drop those rows rather than expose a "null" year.
    const byYear = (facet.byYear || [])
      .filter((row) => row._id !== null && row._id !== undefined)
      .map((row) => {
        const bucket = shapeBucket(row, row._id);
        bucket.topCategories = topByYear[row._id] || [];
        return enrichWithEventStats(
          bucket,
          eventsByYear[row._id],
          volunteersByYear[row._id],
          maxItemsByYear[row._id]
        );
      });

    // Build the all-time bucket and attach its own top-category ranking.
    const allTime = shapeBucket((facet.allTime || [])[0] || null, null);
    allTime.topCategories = (facet.topCategoriesAllTime || []).map((c) => ({
      category: c._id,
      count: c.count,
    }));
    enrichWithEventStats(allTime, eventsAllTime, volunteersAllTime, maxItemsAllTime);

    return sendResponse(res, "Repair stats computed", { stats: { allTime, byYear } });
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
  getRepairStats,
};
