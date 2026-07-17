/**
 * @description item model
 * @requires mongoose
 */

require('dotenv').config();
const process = require('process');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// create item schema
const repairSchema = new Schema(
  {
    acceptsWaiver: {
      $type: String,
      trim: true,
      required: true,
    },
    ownersEmail: {
      $type: String,
      trim: true,
      required: true,
    },
    ownersFirstName: {
      $type: String,
      trim: true,
      required: true,
    },
    ownersLastName: {
      $type: String,
      trim: true,
    },
    product: {
      $type: String,
      trim: true,
      required: true,
    },
    type: {
      $type: String,
      trim: true,
      required: true,
    },
    brand: {
      $type: String,
      trim: true
    },
    model: {
      $type: String,
      trim: true,
    },
    symptoms: {
      $type: String,
      trim: true,
    },
    repairNotes: {
      $type: String,
      trim: true,
    },
    repairerFirstName: {
      $type: String,
      trim: true,
    },
    repairerLastName: {
      $type: String,
      trim: true,
    },
    previousRepairer: {
      $type: String,
      trim: true,
    },
    repairStatus: {
      $type: String,
      trim: true,
    },
    repairBarrier: {
      $type: String,
      trim: true,
    },
    weight: {
      $type: Number,
      min: 0,
    },
    cost: {
      $type: Number,
      min: 0,
    },
    isFollowUpRepair: {
      $type: Boolean,
      default: false,
    },
    weightUnits: {
      $type: String,
      trim: true,
      default: process.env.WEIGHT_UNITS || 'kg'
    },
    costUnits: {
      $type: String,
      trim: true,
      default: process.env.COST_UNITS || 'euros'
    },
    imagesUrls: [{
      $type: String
    }],
    eventId: {
      $type: Schema.Types.ObjectId,
      ref: 'RepairEvent',
      required: true
    },
  },
  {
    typeKey: '$type',
    timestamps: true
  }
);

// export the user model for use in the app
module.exports = mongoose.model("Repair", repairSchema);
