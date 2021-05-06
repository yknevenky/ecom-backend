const express = require("express");
const router = express.Router();

const {
  createCategoryController,
  getCategoryById,
  getCategoryController,
  getAllCategoryController,
  updateCategoryController,
  removeCategoryController
} = require("../controllers/categoryController");
const {
  isAuthenticated,
  isSignedIn,
  isAdmin,
} = require("../controllers/authController");

const { getUserById } = require("../controllers/userController");

router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategoryController
);

router.get("/category/:categoryId", getCategoryController);
router.get("/categories", getAllCategoryController);

router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategoryController
);

router.delete(
    "/category/:categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    removeCategoryController
  );

module.exports = router;
