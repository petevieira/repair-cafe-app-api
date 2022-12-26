/**
 * @description itemType model
 * @requires mongoose
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// create item schema
const itemTypeSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

// export the ItemType model for use in the app
module.exports = mongoose.model("ItemType", itemTypeSchema);
