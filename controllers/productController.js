const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("Category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProductController = (req, res) => {
  console.log("Helllo")
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      console.log("INIT ERRORRRRR")
      return res.status(400).json({
        error: "problem with image",
      });
    }
    console.log(fields, "fields\n")
    // Destructure the fields
    const { price, name, description, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      console.log(name,"name\n", description,"description\n",price,"price\n", category, "category\n", stock, "stock")
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let product = new Product(fields);
    // console.log(product)
    // Handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        console.log("FILE ERRORRRRR")
        return res.status(400).json({
          error: "File size is more than 3 MB",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // Save to DB
    product.save((err, savedProduct) => {
      if (err) {
        console.log("DB ERRORRRRR")
        return res.status(400).json({
          error: "Failed to save in DB",
        });
      }
      console.log(savedProduct, "savedProduct")
      res.json(savedProduct);
    });
  });
};

exports.getProductController = (req, res) => {
  req.product.photo = undefined;
  console.log(req.product)
  return res.json(req.product);
};

// middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateProductController = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //    Updation code
    let product = req.product;
    product = _.extend(product, fields);

    // console.log(product)
    // Handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is more than 3 MB",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // Save to DB
    product.save((err, savedProduct) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to update in DB",
        });
      }
      res.json(savedProduct);
    });
  });
};

exports.deleteProductController = (req, res) => {
  let product = req.product;
  product.remove((err, removedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete product",
      });
    }
    console.log(removedProduct);
    return res.json({
      message: "Deletion success",
      removedProduct,
    });
  });
};

exports.getAllProducts = (req, res) => {
  console.log("exec")
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("Category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No product found",
        });
      }
      return res.json(products);
    });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: {
          $inc: {
            sold: +prod.count,
            stock: -prod.count,
          },
        },
      },
    };
  });


  Product.bulkWrite(myOperations, {}, (err, products) => {
      if(err){
          return res.status(400).json({
              error: "Bulk operation failed"
          })
      }
      next()
  })
};

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("Category", { }, (err, categories) => {
        if(err) {
            return res.status(400).json({
                error: "Failed to get categories"
            })
        }
        res.json(categories)
    })
}