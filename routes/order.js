const express = require("express");
const router = express.Router();

const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} = require("../controllers/authController");

const {
  getUserById,
  pushOrderInPurchaseList,
} = require("../controllers/userController");

const { updateStock } = require("../controllers/productController");

const {
  getOrderById,
  createOrderController,
  getAllOrdersController,
  getOrderStatus,
  updateOrderStatus,
} = require("../controllers/orderController");

router.param("userId", getUserById);
router.param("orderId", getOrderById);

router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrderController
);

router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrdersController
);

router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);
router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateOrderStatus
);

module.exports = router;
