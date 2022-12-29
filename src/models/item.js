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
      typeId: Schema.Types.ObjectId,
      ref: 'ItemType',
      required: true,
    },
    make: {
      type: String,
      trim: true
    },
    model: {
      type: String
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
    ownerId: {
      type: Schema.Type.ObjectId,
      ref: 'User',
      required: true
    },
    primaryRepairerId: {
      type: Schema.Type.ObjectId,
      ref: 'User'
    },
    eventIds: [{
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
