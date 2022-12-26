/**
 * @namespace itemTypes
 * @module item-types-routes
 * @description Router for itemTypes endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express');

// create ExpressJS router
const router = express.Router();

// auth controller actions
const itemTypesController = require("../controllers/item-types-controller");

/**
 * @swagger
 * /events/addItemType:
 *   post:
 *     summary: Adds an item type document to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: item type name
 *               imageUrl:
 *                 type: string
 *                 description: URL to image of item type
 *     responses:
 *       200:
 *         description: Item type added to database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 itemType:
 *                   type: object
 *       400:
 *         description: Invalid request data; ItemType already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */
router.post("/addItemType", itemTypesController.addItemType);

/**
 * @swagger
 * /events/deleteItemType:
 *   post:
 *     summary: Deletes an ItemType, given an ItemType id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemTypeId:
 *                 required: true
 *                 type: string
 *                 description: ID of ItemType to delete
 *     responses:
 *       200:
 *         description: ItemType was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: success message
 *       400:
 *         description: Invalid request data; Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: error message
 */
router.post("/deleteItemType", itemTypesController.deleteItemType);

/**
 * @swagger
 * /events/updateItemType:
 *   post:
 *     summary: Updates an existing ItemType
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updatedItemType:
 *                 type: object
 *                 required: true
 *                 description: New ItemType object with one or more updated properties
 *                 properties:
 *                   _id:
 *                     required: true
 *                     type: string
 *                     description: ID of existing ItemType to modify
 *                   name:
 *                     required: false
 *                     type: string
 *                     description: New name of the ItemType
 *     responses:
 *       200:
 *         description: ItemType was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: object
 *                   description: updated ItemType
 *       400:
 *         description: Invalid request data; ItemType not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: error message
 */
router.post("/updateItemType", itemTypesController.updateItemType);

/**
 * @swagger
 * /events/getItemTypes:
 *   post:
 *     summary: Gets all ItemTypes after appylying client's filter
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filter:
 *                 type: object
 *                 required: false
 *                 description: Filter for query of ItemTypes. See https://mongoosejs.com/docs/api.html#model_Model-find
 *     responses:
 *       200:
 *         description: ItemTypes were found and returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 itemTypes:
 *                   type: array
 *                   description: array of ItemType objects
 *       400:
 *         description: Invalid request data; Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */
router.post("/getItemTypes", itemTypesController.getItemTypes);

// export router to app can use it
module.exports = router;
