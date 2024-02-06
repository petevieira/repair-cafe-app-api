/**
 * @description text model
 * @requires mongoose
 */

mongoose = require('mongoose');
const { Schema } = mongoose;

// create schema
const textSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

// export the model for use in the app
module.exports = mongoose.model("Text", textSchema);
