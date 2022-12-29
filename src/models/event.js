/**
 * @description event model
 * @requires mongoose
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// create event schema
const eventSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true
    },
    locationName: {
      type: String,
      trim: true,
      required: true,
    },
    locationAddress: {
      type: String,
      trim: true,
      required: true,
    },
    startDatetime: {
      type: Date,
      required: true
    },
    endDatetime: {
      type: Date,
      required: true
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    itemIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Item',
    }],
    userIds: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {
    timestamps: true
  }
);

// export the event model for use in the app
module.exports = mongoose.model("Event", eventSchema);
