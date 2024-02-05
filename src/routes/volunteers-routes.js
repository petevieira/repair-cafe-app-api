
const express = require('express'); // for access to ExpressJS router
const volunteersController = require('../controllers/volunteers-controller');
const { authenticateToken, requireIsAdmin, requireSignin } = require('../middleware');
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

router.get("/get-past-volunteers",
  authenticateToken,
  requireSignin,
  requireIsAdmin,
  volunteersController.getPastVolunteers
);

router.post("/add-volunteer",
  authenticateToken,
  requireSignin,
  requireIsAdmin,
  volunteersController.addVolunteer
);

router.delete("/delete-volunteer/:id",
  authenticateToken,
  requireSignin,
  requireIsAdmin,
  volunteersController.deleteVolunteer
);

router.put("/update-volunteer",
  authenticateToken,
  requireSignin,
  requireIsAdmin,
  volunteersController.updateVolunteer
);

router.get("/get-volunteer/:id",
  authenticateToken,
  requireSignin,
  requireIsAdmin,
  volunteersController.getVolunteer
);

module.exports = router;