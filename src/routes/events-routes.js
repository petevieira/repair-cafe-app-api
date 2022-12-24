/**
 * @module routes
 * @description Router for events endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express');

// create ExpressJS router
const router = express.Router();

// auth controller actions
const eventsController = require("../controllers/events-controller");

// request to add an event
router.post("/addEvent", eventsController.addEvent);

// request to delete an event
router.post("/deleteEvent", eventsController.deleteEvent);

// request to update an event
router.post("/updateEvent", eventsController.updateEvent);

// request to get all events
router.post("/getEvents", eventsController.getEvents);

// export router to app can use it
module.exports = router;
