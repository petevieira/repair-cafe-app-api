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
    startDateTime: {
      type: Date,
      required: true
    },
    endDateTime: {
      type: Date,
      required: true
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// export the user model for use in the app
export default mongoose.model("Event", eventSchema);
