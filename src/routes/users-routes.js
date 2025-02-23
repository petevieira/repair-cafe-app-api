/**
 * @namespace users
 * @module users-routes
 * @description Router for user authentication endpoints
 * @requires express
 */

const express = require('express'); // for access to ExpressJS router
const usersController = require('../controllers/users-controller');
const { authenticateToken, requireIsAdmin, requireSignin } = require('../middleware');

const router = express.Router(); // create ExpressJS router

router.get("/email-is-registered/:email", usersController.emailIsRegistered);
router.post("/sign-in", usersController.signIn);
router.post("/user-is-admin",
    authenticateToken,
    requireSignin,
    requireIsAdmin,
    usersController.userIsAdmin
);

// Export router to app can use it
module.exports = router;
