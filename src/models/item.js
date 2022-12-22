/**
 * @description item model
 * @requires mongoose
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// create user schema
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
    images: {
      public_id: "",
      url: "",
    },
    resetCode: "",
  },
  {
    timestamps: true
  }
);

// export the user model for use in the app
export default mongoose.model("User", userSchema);
