/**
 * @module routes
 * @description Router for authentication endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express');

// create ExpressJS router
const router = express.Router();

// auth controller actions
const authController = require("../controllers/auth");

// home page
router.get("/", (req, res) => {
  return res.json({
    data: "hello world from Tucson Repair Cafe auth API",
  });
});

// signup page request
router.post("/signup", authController.signUp);

// signin page request
router.post("/signin", authController.signIn);

// forgot-password page request
router.post("/forgot-password", authController.forgotPassword);

// reset-password page request
router.post("/reset-password", authController.resetPassword);

// export router to app can use it
module.exports = router;
