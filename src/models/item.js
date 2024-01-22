/**
 * @description item model
 * @requires mongoose
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// create item schema
const itemSchema = new Schema(
  {
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
    notes: {
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
    status: {
      $type: String,
      trim: true,
    },
    imagesUrls: [{
      $type: String
    }],
  },
  {
    typeKey: '$type',
    timestamps: true
  }
);

// export the user model for use in the app
module.exports = mongoose.model("Item", itemSchema);
