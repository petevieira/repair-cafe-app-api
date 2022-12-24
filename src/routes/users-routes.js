/**
 * @module routes
 * @description Router for user authentication endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express');

// create ExpressJS router
const router = express.Router();

// users controller actions
const usersController = require("../controllers/users-controller");

// home page
router.get("/", (req, res) => {
  return res.json({
    data: "hello world from Tucson Repair Cafe auth API",
  });
});

// signup page request
router.post("/signup", usersController.signUp);

// signin page request
router.post("/signin", usersController.signIn);

// forgot-password page request
router.post("/forgot-password", usersController.forgotPassword);

// reset-password page request
router.post("/reset-password", usersController.resetPassword);

// export router to app can use it
module.exports = router;
