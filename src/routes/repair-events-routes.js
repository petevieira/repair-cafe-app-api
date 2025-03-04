/**
 * @namespace events
 * @module events-routes
 * @description Router for events endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express'); // for access to ExpressJS router
const repairEventsController = require("../controllers/repair-events-controller");
const { authenticateToken, requireIsAdmin, requireSignin } = require('../middleware');

// create ExpressJS router
const router = express.Router();

router.post("/create-event/",
    authenticateToken,
    requireSignin,
    requireIsAdmin,
    repairEventsController.createEvent,
);

router.delete("/delete-event-by-id/:id",
    authenticateToken,
    requireSignin,
    requireIsAdmin,
    repairEventsController.deleteEventById,
);

router.post("/get-event-by-date/",
    repairEventsController.getEventByDate,
)

router.post("/update-event/",
    authenticateToken,
    requireSignin,
    requireIsAdmin,
    repairEventsController.updateEvent,
);

router.get("/get-events/",
    authenticateToken,
    requireSignin,
    requireIsAdmin,
    repairEventsController.getEvents,
);

router.post("/get-event-by-id/",
    authenticateToken,
    requireSignin,
    requireIsAdmin,
    repairEventsController.getEventById,
)

router.post("/get-most-recent-event/",
    repairEventsController.getMostRecentEvent,
);

router.post("/find-previous-event/",
    authenticateToken,
    requireSignin,
    repairEventsController.findPreviousEvent,
)

router.post("/find-next-event/",
    authenticateToken,
    requireSignin,
    repairEventsController.findNextEvent,
)

module.exports = router;
