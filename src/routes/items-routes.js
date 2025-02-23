/**
 * @namespace items
 * @module items-routes
 * @description Router for items endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express'); // for access to ExpressJS router
const itemsController = require("../controllers/items-controller");
const {
    authenticateToken, requireIsAdmin, requireSignin, requireIsVolunteer,
} = require('../middleware');

// create ExpressJS router
const router = express.Router();

router.post("/add-full-item",
  authenticateToken,
  requireSignin,
  requireIsVolunteer,
  itemsController.addFullItem
);

router.delete("/delete-item/:id",
  authenticateToken,
  requireSignin,
  requireIsAdmin,
  itemsController.deleteItem
);

router.put("/update-item",
  authenticateToken,
  requireSignin,
  requireIsVolunteer,
  itemsController.updateItem
);

router.get("/get-items-basic/:date",
  itemsController.getItemsBasic
);

router.get("/get-item/:id",
  authenticateToken,
  requireSignin,
  requireIsVolunteer,
  itemsController.getItem
);

router.get("/find-owner-by-email/:email",
  authenticateToken,
  requireSignin,
  requireIsVolunteer,
  itemsController.findOwnerByEmail
);

router.get("/find-incomplete-items-by-owner/:email",
    authenticateToken,
    requireSignin,
    requireIsVolunteer,
    itemsController.findIncompleteItemsByOwner
);

module.exports = router;
