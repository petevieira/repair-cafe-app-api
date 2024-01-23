/**
 * @namespace repairs
 * @module repairs-routes
 * @description Router for repairs endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express'); // for access to ExpressJS router
const itemsController = require("../controllers/items-controller");
const Auth = require('../helpers/auth-helpers');

// create ExpressJS router
const router = express.Router();

// define /items/* routes
router.post("/add-basic-item", itemsController.addBasicItem);
router.post("/add-full-item", Auth.authenticateToken, itemsController.addFullItem);
router.delete("/delete-item/:id", Auth.authenticateToken, itemsController.deleteItem);
router.put("/update-item", Auth.authenticateToken, itemsController.updateItem);
router.get("/get-items-basic/:date", itemsController.getItemsBasic);

module.exports = router;
