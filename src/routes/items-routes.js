/**
 * @namespace items
 * @module items-routes
 * @description Router for items endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express'); // for access to ExpressJS router
const itemsController = require("../controllers/items-controller");
const { authenticateToken, isAdmin, requireSignin } = require('../middleware');

// create ExpressJS router
const router = express.Router();

// define /items/* routes
router.post("/add-basic-item",
  itemsController.addBasicItem
);

router.post("/add-full-item",
  authenticateToken,
  requireSignin,
  isAdmin,
  itemsController.addFullItem
);

router.delete("/delete-item/:id",
  authenticateToken,
  requireSignin,
  isAdmin,
  itemsController.deleteItem
);

router.put("/update-item",
  authenticateToken,
  requireSignin,
  isAdmin,
  itemsController.updateItem
);

router.get("/get-items-basic/:date",
  itemsController.getItemsBasic
);

router.get("/get-item/:id",
  authenticateToken,
  requireSignin,
  isAdmin,
  itemsController.getItem
);

router.delete("/delete-item/:id",
  authenticateToken,
  requireSignin,
  isAdmin,
  itemsController.deleteItem
);

module.exports = router;
