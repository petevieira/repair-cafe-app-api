/**
 * @description event model
 * @requires mongoose
 */

mongoose = require('mongoose');
const { Schema } = mongoose;

// create schema
const eventSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
  },
);

// export the model for use in the app
module.exports = mongoose.model("Event", eventSchema);
