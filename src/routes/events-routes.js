/**
 * @namespace events
 * @module events-routes
 * @description Router for events endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express');

// create ExpressJS router
const router = express.Router();

// auth controller actions
const eventsController = require("../controllers/events-controller");

/**
 * @swagger
 * /events/addEvent:
 *   post:
 *     summary: Adds an event document to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Event title
 *               description:
 *                 type: string
 *                 description: Summary of event
 *               locationName:
 *                 type: string
 *                 description: Name of event location
 *               locationAddress:
 *                 type: string
 *                 description: Address of event location
 *               startDatetime:
 *                 type: string
 *                 description: Date and time of start of event
 *               endDatetime:
 *                 type: string
 *                 description: Date and time of end of event
 *               imageUrl:
 *                 type: string
 *                 description: URL to event image
 *     responses:
 *       200:
 *         description: Added event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: object
 *       400:
 *         description: Invalid request data; Event already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/add-event", eventsController.addEvent);

/**
 * @swagger
 * /events/deleteEvent:
 *   post:
 *     summary: Deletes an event, given an event id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 required: true
 *                 type: string
 *                 description: ID of event to delete
 *     responses:
 *       200:
 *         description: Event was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: success message
 *       400:
 *         description: Invalid request data; Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: error message
 */
router.post("/delete-event", eventsController.deleteEvent);

/**
 * @swagger
 * /events/updateEvent:
 *   post:
 *     summary: Updates an existing event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updatedEvent:
 *                 type: object
 *                 required: true
 *                 description: New event object with one or more updated properties
 *                 properties:
 *                   _id:
 *                     required: true
 *                     type: string
 *                     description: ID of existing event to modify
 *                   title:
 *                     required: false
 *                     type: string
 *                     description: New title of the event
 *     responses:
 *       200:
 *         description: Event was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: object
 *                   description: updated event
 *       400:
 *         description: Invalid request data; Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: error message
 */
router.post("/update-event", eventsController.updateEvent);

/**
 * @swagger
 * /events/getEvents:
 *   post:
 *     summary: Gets all events after applying client's filter
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filter:
 *                 type: object
 *                 required: false
 *                 description: Filter for query of events. See https://mongoosejs.com/docs/api.html#model_Model-find
 *     responses:
 *       200:
 *         description: Events were found and returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   description: array of event objects
 *       400:
 *         description: Invalid request data; Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/get-events", eventsController.getEvents);

// export router to app can use it
module.exports = router;
