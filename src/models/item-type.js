/**
 * @description itemType model
 * @requires mongoose
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// create item schema
const itemTypeSchema = new Schema(
  {
    type: {
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

// export the user model for use in the app
export default mongoose.model("ItemType", itemTypeSchema);
