/**
 * @namespace repairs
 * @module repairs-routes
 * @description Router for repairs endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express');

// create ExpressJS router
const router = express.Router();

// items controller actions
const itemsController = require("../controllers/items-controller");
const Auth = require('../helpers/auth-helpers');

router.post("/add-basic-item", itemsController.addBasicItem);
router.post("/add-full-item", itemsController.addFullItem);
router.post("/delete-item", itemsController.deleteItem);
router.post("/update-item", itemsController.updateItem);
router.post("/get-items-basic", itemsController.getItemsBasic);
// router.post("/get-items-full", itemsController.getItemFull);

// export router to app can use it
module.exports = router;
