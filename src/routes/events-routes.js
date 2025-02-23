/**
 * @namespace events
 * @module events-routes
 * @description Router for events endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express'); // for access to ExpressJS router
const eventsController = require("../controllers/events-controller");
const { authenticateToken, requireIsAdmin, requireSignin } = require('../middleware');

// create ExpressJS router
const router = express.Router();

router.post("/create-event/",
    authenticateToken,
    requireSignin,
    requireIsAdmin,
    eventsController.createEvent,
);

router.delete("/delete-event-by-id/",
    authenticateToken,
    requireSignin,
    requireIsAdmin,
    eventsController.deleteEventById,
);

router.post("/update-event/",
    authenticateToken,
    requireSignin,
    requireIsAdmin,
    eventsController.updateEvent,
);

router.get("/get-events/",
    authenticateToken,
    requireSignin,
    requireIsAdmin,
    eventsController.getEvents,
);

router.post("/get-event-by-id/",
    authenticateToken,
    requireSignin,
    requireIsAdmin,
    eventsController.getEventById,
)

router.post("/get-most-recent-event/",
    eventsController.getMostRecentEvent,
);

module.exports = router;
