const express = require("express");
const router = express.Router();

const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} = require("../controllers/authController");

const { getUserById } = require("../controllers/userController");

const {
  getProductById,
  createProductController,
  getProductController,
  photo,
  deleteProductController,
  updateProductController,
  getAllProducts,
  getAllUniqueCategories
} = require("../controllers/productController");

router.param("userId", getUserById);
router.param("productId", getProductById);

router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProductController
);

router.get("/product/:productId", getProductController);
router.get("/product/photo/:productId", photo);

router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProductController
);

router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProductController
);

router.get("/products", getAllProducts);

router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
