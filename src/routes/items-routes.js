/**
 * @namespace items
 * @module items-routes
 * @description Router for items endpoints
 * @requires express
 */

// for access to ExpressJS router
const express = require('express');

// create ExpressJS router
const router = express.Router();

// users controller actions
const itemsController = require("../controllers/items-controller");

/**
 * @swagger
 * /items/addItem:
 *   post:
 *     summary: Adds a new item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first:
 *                 type: string
 *                 required: true
 *                 description: First name of new user
 *               last:
 *                 type: string
 *                 required: true
 *                 description: Last name of new user
 *               email:
 *                 type: string
 *                 required: true
 *                 description: Valid email of new user
 *               password:
 *                 type: string
 *                 required: true
 *                 description: Password for new user
 *     responses:
 *       200:
 *         description: User was created and returned with token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JSON Web Token for authorization of requests
 *                 user:
 *                   type: object
 *                   description: User object
 *       400:
 *         description: Invalid request data; Email already taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Saving of new user failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/addItem", itemsController.addItem);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: Signs in an existing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *                 description: Valid email of user
 *               password:
 *                 type: string
 *                 required: true
 *                 description: Password for user
 *     responses:
 *       200:
 *         description: User was signed in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JSON Web Token for authorization of requests
 *                 user:
 *                   type: object
 *                   description: User object
 *       400:
 *         description: Invalid request data; Email already taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Saving of new user failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/deleteItem", itemsController.deleteItem);

// forgot-password page request
router.post("/updateItem", itemsController.updateItem);

// reset-password page request
router.post("/getItems", itemsController.getItems);

// reset-password page request
router.post("/getItem", itemsController.getItem);

// export router to app can use it
module.exports = router;
