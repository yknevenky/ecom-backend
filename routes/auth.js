const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  signUpController,
  signOutController,
  signInController,
  isSignedIn
} = require("../controllers/authController");

router.post(
  "/signup",
  [
    check(
      "firstName",
      "First name should be at least 3 characters long"
    ).isLength({ min: 3 }),
    check("email", "Email not valid").isEmail(),
    check(
      "password",
      "Password should be at least 3 characters long"
    ).isLength({ min: 3 }),
  ],
  signUpController
);

router.post(
  "/signin",
  [

    check("email", "Email not valid").isEmail(),
    check(
      "password",
      "Password is required"
    ).isLength({ min: 1 }),
  ],
  signInController
);

router.get("/signout",isSignedIn, signOutController);

module.exports = router;
