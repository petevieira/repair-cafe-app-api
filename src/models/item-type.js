/**
 * @description item type model
 * @requires mongoose
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// create item type schema
const itemTypeSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    productCategory: {
      type: String,
      trim: true,
      required: true,
    },
  },
);

module.exports = mongoose.model("ItemType", itemTypeSchema);
