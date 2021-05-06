const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to get the order",
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrderController = (req, res) => {
  req.body.order.user = req.profile.user;
  const order = new Order(req.body);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to create the order",
      });
    }
    res.json(order);
  });
};

exports.getAllOrdersController = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to get oders",
        });
      }
      res.json(orders);
    });
};

exports.updateOrderStatus = (req, res) => {
  Order.updateOne(
    {
      _id: req.body.orderId,
    },
    {
      $set: { status: req.body.status },
    },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to update the status of the order",
        });
      }
      res.json(order);
    }
  );
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};
