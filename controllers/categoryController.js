const Category = require("../models/category");
const formidable = require("formidable");
const _ = require("lodash");


exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found",
      });
    }
    console.log("cat id", category)
    req.category = category;
    next();
  });
};

exports.createCategoryController = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category cannot be created in DB",
      });
    }
    return res.json({ category });
  });
};

exports.getCategoryController = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategoryController = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(400).json({
        error: "No categories found",
      });
    }
    return res.json(categories);
  });
};

exports.updateCategoryController = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image",
        });
      }
  
      //    Updation code
      let category = req.category;
      product = _.extend(category, fields);
  
      // console.log(product)
      // Handle file here
      // Save to DB
      category.save((err, savedCategory) => {
        if (err) {
          return res.status(400).json({
            error: "Failed to update in DB",
          });
        }
        res.json(savedCategory);
      });
    });
};

exports.removeCategoryController = (req, res) => {
  const category = req.category;
  console.log("from remove", req.category)
  category.remove((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Failed to remove the category",
      });
    }
    res.json(category);
  });
};
