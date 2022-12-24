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
      type: String,
      trim: true,
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
    symptoms: [{
      type: String,
    }],
    status: {
      type: String,
    },
    repairDetails: {
      type: String,
    },
    imagesUrls: [{
      type: String
    }],
  },
  {
    timestamps: true
  }
);

// export the user model for use in the app
export default mongoose.model("Item", itemSchema);
