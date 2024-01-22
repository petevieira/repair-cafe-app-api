/**
 * @namespace users
 * @module users-routes
 * @description Router for user authentication endpoints
 * @requires express
 */

const express = require('express'); // for access to ExpressJS router
const router = express.Router(); // create ExpressJS router

// users controller actions
const usersController = require('../controllers/users-controller');
const Auth = require('../helpers/auth-helpers');
const User = require('../models/user'); // import User model
/**
 */
router.get("/", async (req, res) => {
  const users = await User.find();
  console.log("users: ", users);
  return res.json({
    data: users,
  });
});

router.post("/email-is-registered", usersController.emailIsRegistered);

router.post("/email-is-registered-as-admin", usersController.emailIsRegisteredAsAdmin);

router.post("/sign-up", usersController.signUp);

router.post("/sign-in", usersController.signIn);

router.post("/sign-in-admin", usersController.signInAdmin);

// forgot-password page request
router.post("/forgot-password", usersController.forgotPassword);

// reset-password page request
router.post("/reset-password", usersController.resetPassword);

// export router to app can use it
module.exports = router;
