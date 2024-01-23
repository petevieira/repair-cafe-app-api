
const express = require('express'); // for access to ExpressJS router
const volunteersController = require('../controllers/volunteers-controller');
const { authenticateToken, isAdmin, requireSignin } = require('../middleware');
const { expressjwt } = require('express-jwt');

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
  volunteersController.getDaysVolunteers
);
router.post("/add-volunteer",
  authenticateToken,
  requireSignin,
  isAdmin,
  volunteersController.addVolunteer
);
router.delete("/delete-volunteer/:id",
  authenticateToken,
  requireSignin,
  isAdmin,
  volunteersController.deleteVolunteer
);
router.put("/update-volunteer",
  authenticateToken,
  requireSignin,
  isAdmin,
  volunteersController.updateVolunteer
);

module.exports = router;