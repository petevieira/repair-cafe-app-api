/**
 * @module routes
 * @description Router for authentication endpoints
 * @requires express
 */

import express from "express";

// create ExpressJS router
const router = express.Router();

// auth controller actions
const {
  signup,
  signin,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

// home page
router.get("/", (req, res) => {
  return res.json({
    data: "hello world from kaloraat auth API",
  });
});

// signup page request
router.post("/signup", signup);

// signin page request
router.post("/signin", signin);

// forgot-password page request
router.post("/forgot-password", forgotPassword);

// reset-password page request
router.post("/reset-password", resetPassword);

// export router to app can use it
export default router;
