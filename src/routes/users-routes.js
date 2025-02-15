/**
 * @namespace users
 * @module users-routes
 * @description Router for user authentication endpoints
 * @requires express
 */

const express = require('express'); // for access to ExpressJS router
const usersController = require('../controllers/users-controller');

const router = express.Router(); // create ExpressJS router

router.get("/user-is-admin/:email", usersController.userIsAdmin);
router.post("/sign-in-admin", usersController.signInAdmin);

// Export router to app can use it
module.exports = router;
