/**
* @file users-controller.js
* @namespace users
* @module users-controller
* @description controller actions for user authentication endpoints
* @requires jsonwebtoken
*/

const { StatusCodes } = require('http-status-codes'); // for HTTP status codes
const User = require('../models/user'); // import User model
const { comparePassword, createSignedToken } = require('../helpers/auth-helpers'); // password helpers
const { sendResponse, validateRequest } = require('../helpers/rest-helpers'); // validator
require("dotenv").config(); // parse .env file

async function emailIsRegistered(req, res) {
    // Check for required request params
    const result = validateRequest(req.params, ['email']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    const email = req.params.email;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return sendResponse(
                res, `User with email ${email} not found`, { isRegistered: false }, StatusCodes.BAD_REQUEST
            );
        }
        return sendResponse(res, `User with email ${email} is an admin`, { isRegistered: true });
    } catch (err) {
        console.error(err);
        return sendResponse(res, err, {}, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signIn(req, res) {
    // Check for required request params
    const result = validateRequest(req.body, ['email', 'password']);
    if (result !== true) {
        return sendResponse(res, result, {}, StatusCodes.BAD_REQUEST);
    }

    try {
        const { email, password } = req.body;
        console.debug(`User attempting to sign in with email: ${email}, password: ${password}`);

        // check if our db has user with that email
        const user = await User.findOne({ email: email });
        if (!user) {
            return sendResponse(
                res, `No user found with email ${email}`, {}, StatusCodes.BAD_REQUEST
            );
        }

        if (user.role !== "volunteer" && user.role !== "admin") {
            return sendResponse(
                res, `User with email ${email} not admin`, {}, StatusCodes.UNAUTHORIZED
            );
        }

        // check password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return sendResponse(res, 'Wrong password', {}, StatusCodes.BAD_REQUEST);
        }

        // create signed token
        const token = await createSignedToken({ _id: user._id, role: user.role });

        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict', // helps mitigate CSRF attacks
        //     maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        // });

        // get rid of sensitive info for security
        user.password = undefined;
        user.secret = undefined;
        user.resetCode = undefined;

        // return success with token and created user object
        return sendResponse(res, 'User successfully signed in', { user, token });
    } catch (err) {
        console.error(err);
        return sendResponse(res, err, {}, StatusCodes.BAD_REQUEST);
    }
}

const signedInUserIsAdmin = async (req, res) => {
    // Get user from auth
    const authUser = req.auth._id;

    if (!authUser) {
        return sendResponse(res, 'No auth user found in request', {}, StatusCodes.BAD_REQUEST);
    }

    if (authUser.role !== "admin") {
        return sendResponse(res, 'User is not an admin', { isAdmin: false });
    }

    const id = authUser._id;

    // Get user by authUser _id
    const user = await User
        .findOne({ _id: id })
        .select('role');

    if (!user) {
        return sendResponse(res, `No user found with id ${id}`, {}, StatusCodes.BAD_REQUEST);
    }
    if (user.role !== "admin") {
        return sendResponse(res, `User with id ${id} not an admin`, { isAdmin: false });
    }
    return sendResponse(res, `User with id ${id} is an admin`, { isAdmin: true });
}

module.exports = {
    signIn,
    emailIsRegistered,
    signedInUserIsAdmin,
};
