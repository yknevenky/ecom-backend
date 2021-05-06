const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User does not exist",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  // TODO: GET BACK HERE FOR PASSWORD
  req.profile.salt = undefined;
  req.profile.encryPassword = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  req.profile.__v = undefined;
  return res.json(req.profile);
};

exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err || !users) {
      return res.json({
        error: "No users found",
      });
    }
    return res.json(users);
  });
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, updatedUser) => {
      if (err || !updatedUser) {
        return res.status(400).json({
          error: "You are not authorized to update this user",
        });
      }
      updatedUser.salt = undefined;
      updatedUser.encryPassword = undefined;
      updatedUser.createdAt = undefined;
      updatedUser.updatedAt = undefined;
      updatedUser.__v = undefined;
      return res.json({ updatedUser });
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("User", "_id firstName email")
    .exec((err, orders) => {
      if (err || !orders) {
        return res.status(400).json({
          error: "No Orders for this user exists",
        });
      }
      return res.json(orders);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transactionId: req.body.order.transactionId,
    });
  });

  User.findOneAndUpdate(
    {
      _id: req.profile._id,
    },
    {
      $push: {
        purchases: purchases,
      },
    },
    { new: true }, //send me the updated obj from db not the old obj
    (err, purchaseList) => {
      if (err || !purchase) {
        return res.status(400).json({
          error: "Unable to save the purchase list",
        });
      }
      next();
    }
  );
};
