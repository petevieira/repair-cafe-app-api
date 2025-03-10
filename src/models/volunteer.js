/**
 * @description volunteer model
 * @requires mongoose
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// create volunteer schema
const volunteerSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: false,
    },
    acceptsWaiver: {
      type: Boolean,
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "RepairEvent",
      required: true,
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
