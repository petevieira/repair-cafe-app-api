/**
 * @namespace subscribers
 * @module subscribers-routes
 * @description Router for subscribers endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express'); // for access to ExpressJS router
const subscribersController = require("../controllers/subscribers-controller");
const {
    authenticateToken, requireIsAdmin, requireSignin, requireIsVolunteer
} = require('../middleware');

// create ExpressJS router
const router = express.Router();

router.get("/get-subscribers",
    authenticateToken,
    requireSignin,
    requireIsAdmin,
    subscribersController.getSubscribers
);

router.post("/add-subscriber",
    authenticateToken,
    requireSignin,
    requireIsVolunteer,
    subscribersController.addSubscriber
);

router.post("/delete-subscriber",
    authenticateToken,
    requireSignin,
    requireIsVolunteer,
    subscribersController.deleteSubscriber
);

router.post("/is-email-subscribed",
    authenticateToken,
    requireSignin,
    requireIsVolunteer,
    subscribersController.isEmailSubscribed
);

module.exports = router;
