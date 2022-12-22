/**
 * @module routes
 * @description Router for authentication endpoints
 * @requires express
 */

const express = require('express');

// create ExpressJS router
const router = express.Router();

// auth controller actions
const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

// home page
router.get("/", (req, res) => {
  return res.json({
    data: "hello world from Tucson Repair Cafe auth API",
  });
});

// signup page request
router.post("/signup", signUp);

// signin page request
router.post("/signin", signIn);

// forgot-password page request
router.post("/forgot-password", forgotPassword);

// reset-password page request
router.post("/reset-password", resetPassword);

// export router to app can use it
module.exports = router;
