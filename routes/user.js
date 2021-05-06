const express = require("express");
const router = express.Router();

const {
  isAuthenticated,
  isAdmin,
  isSignedIn,
} = require("../controllers/authController");
const { getUserById, getUser, getAllUsers, updateUser, userPurchaseList } = require("../controllers/userController");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.get("/users", getAllUsers)
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;
