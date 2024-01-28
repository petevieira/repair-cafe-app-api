/**
 * @namespace users
 * @module users-routes
 * @description Router for user authentication endpoints
 * @requires express
 */

const express = require('express'); // for access to ExpressJS router
const router = express.Router(); // create ExpressJS router
const rootController = require('../controllers/root-controller');

router.get("", rootController.home);

// export router to app can use it
module.exports = router;
