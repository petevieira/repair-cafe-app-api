
const express = require('express'); // for access to ExpressJS router
const volunteersController = require('../controllers/volunteers-controller');
const Auth = require('../helpers/auth-helpers');
const Volunteer = require('../models/volunteer');

// create ExpressJS router
const router = express.Router();

// define /volunteer/* routes
/**
 * Pass in date at 12am in local time converted to UTC time.
 * e.g.:
 * 2024-01-02T00:00:00 GMT-0700 // arizona time start of Jan 2nd.
 * 2024-01-02T07:00:00.000Z // start of Jan 2nd in Arizona in UTC time
 */
router.get("/get-days-volunteers/:date",
  volunteersController.getDaysVolunteers);
router.post("/add-volunteer",
  Auth.authenticateToken, volunteersController.addVolunteer);
router.delete("/delete-volunteer/:id",
  Auth.authenticateToken, volunteersController.deleteVolunteer);
router.put("/update-volunteer",
  Auth.authenticateToken, volunteersController.updateVolunteer);

module.exports = router;