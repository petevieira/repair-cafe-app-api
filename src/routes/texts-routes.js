/**
 * @namespace text
 * @module texts-routes
 * @description Router for text endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express'); // for access to ExpressJS router
const textsController = require("../controllers/texts-controller");
const { authenticateToken, requireIsAdmin, requireSignin } = require('../middleware');

// create ExpressJS router
const router = express.Router();

router.get("/get-text/:field",
    textsController.getText
);

module.exports = router;
