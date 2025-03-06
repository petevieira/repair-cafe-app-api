/**
 * @namespace repairs
 * @module repairs-routes
 * @description Router for repairs endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express'); // for access to ExpressJS router
const repairsController = require("../controllers/repairs-controller");
const {
    authenticateToken, requireIsAdmin, requireSignin, requireIsVolunteer,
} = require('../middleware');

// create ExpressJS router
const router = express.Router();

router.post("/add-full-repair",
  authenticateToken,
  requireSignin,
  requireIsVolunteer,
  repairsController.addFullRepair
);

router.delete("/delete-repair/:id",
  authenticateToken,
  requireSignin,
  requireIsAdmin,
  repairsController.deleteRepair
);

router.put("/update-repair",
  authenticateToken,
  requireSignin,
  requireIsVolunteer,
  repairsController.updateRepair
);

router.get("/get-repairs-basic/:eventId",
    repairsController.getRepairsBasic
);

router.get("/get-repair/:id",
  authenticateToken,
  requireSignin,
  requireIsVolunteer,
  repairsController.getRepair
);

router.get("/find-owner-by-email/:email",
  authenticateToken,
  requireSignin,
  requireIsVolunteer,
  repairsController.findOwnerByEmail
);

router.get("/find-incomplete-repairs-by-owner/:email",
    authenticateToken,
    requireSignin,
    requireIsVolunteer,
    repairsController.findIncompleteRepairsByOwner
);

module.exports = router;
