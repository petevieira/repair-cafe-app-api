/**
 * @description item model
 * @requires mongoose
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// create item schema
const itemSchema = new Schema(
  {
    type: {
      type: Schema.Types.ObjectId,
      ref: 'ItemType',
      required: true,
    },
    make: {
      type: String,
      trim: true,
      required: true,
    },
    model: {
      type: String,
      required: false,
    },
    symptoms: {
      type: String,
    },
    possibleCauses: {
      type: String
    },
    repairDetails: {
      type: String,
    },
    status: {
      type: String,
    },
    imagesUrls: [{
      type: String
    }],
    owner: {
      type: Schema.Type.ObjectId,
      ref: 'User',
      required: true
    },
    repairers: [{
      type: Schema.Type.ObjectId,
      ref: 'User',
      required: true
    }],
    events: [{
      type: Schema.Type.ObjectId,
      ref: 'Event',
      required: true
    }]
  },
  {
    timestamps: true
  }
);

// export the user model for use in the app
export default mongoose.model("Item", itemSchema);
