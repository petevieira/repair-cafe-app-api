/**
 * @description subscriber model
 * @requires mongoose
 */

mongoose = require('mongoose');
const { Schema } = mongoose;

// create schema
const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

// export the model for use in the app
module.exports = mongoose.model("Subscriber", subscriberSchema);
