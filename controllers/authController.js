require("dotenv").config();
const { validationResult } = require("express-validator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signOutController = (req, res) => {
  res.json({ message: "SIGNOUT WORKS" });
};

exports.signInController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "EMAIL DOES NOT EXIST",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "EMAIL AND PASSWORD DOES NOT MATCH",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 9999 });
    const { _id, firstName, email, role } = user;
    res.json({
      token,
      user: {
        _id,
        firstName,
        email,
        role,
      },
    });
  });
};

exports.signUpController = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT ABLE TO SAVE USER IN DB",
      });
    }
    return res.json(user);
  });
};

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth._id == req.profile._id && req.auth;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  console.log("HE HEY EHYE")
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});