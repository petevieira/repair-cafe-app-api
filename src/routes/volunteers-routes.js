const express = require('express'); // for access to ExpressJS router
const router = express.Router(); // create ExpressJS router

// users controller actions
const volunteersController = require('../controllers/volunteers-controller');
const Auth = require('../helpers/auth-helpers');
const Volunteer = require('../models/volunteer');

router.post("/add-volunteer", volunteersController.addVolunteer);
/**
 * Pass in date at 12am in local time converted to UTC time.
 * e.g.:
 * 2024-01-02T00:00:00 GMT-0700 // arizona time start of Jan 2nd.
 * 2024-01-02T07:00:00.000Z // start of Jan 2nd in Arizona in UTC time
 */
router.post("/get-days-volunteers", volunteersController.getDaysVolunteers);
router.post("/delete-volunteer", volunteersController.deleteVolunteer);

module.exports = router;