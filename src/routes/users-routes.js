/**
 * @namespace users
 * @module users-routes
 * @description Router for user authentication endpoints
 * @requires express
 */

const express = require('express'); // for access to ExpressJS router
const router = express.Router(); // create ExpressJS router

// users controller actions
const usersController = require('../controllers/users-controller');
const Auth = require('../helpers/auth-helpers');
const User = require('../models/user'); // import User model
/**
 */
router.get("/", async (req, res) => {
  const users = await User.find();
  console.log("users: ", users);
  return res.json({
    data: users,
  });
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Signs up a new user
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
router.post("/sign-up", usersController.signUp);

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
router.post("/sign-in", usersController.signIn);

// forgot-password page request
router.post("/forgot-password", usersController.forgotPassword);

// reset-password page request
router.post("/reset-password", usersController.resetPassword);

// export router to app can use it
module.exports = router;
