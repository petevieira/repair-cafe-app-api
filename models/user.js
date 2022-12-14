/**
 * @description user model
 * @requires mongoose
 */

import mongoose from "mongoose";
const { Schema } = mongoose;

// create user schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    role: {
      type: String,
      default: "user",
    },
    image: {
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
