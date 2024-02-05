/**
 * @namespace items
 * @module items-routes
 * @description Router for items endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express'); // for access to ExpressJS router
const itemsController = require("../controllers/items-controller");
const { authenticateToken, requireIsAdmin, requireSignin } = require('../middleware');

// create ExpressJS router
const router = express.Router();

router.post("/add-full-item",
  authenticateToken,
  requireSignin,
  requireIsAdmin,
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
  requireIsAdmin,
  itemsController.updateItem
);

router.get("/get-items-basic/:date",
  itemsController.getItemsBasic
);

router.get("/get-item/:id",
  authenticateToken,
  requireSignin,
  requireIsAdmin,
  itemsController.getItem
);

router.delete("/delete-item/:id",
  authenticateToken,
  requireSignin,
  requireIsAdmin,
  itemsController.deleteItem
);

module.exports = router;
