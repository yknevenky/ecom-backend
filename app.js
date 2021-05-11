require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// Route imports
app.use(cors());

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const brainTreePaymentRoute = require("./routes/brainTreePayment")

const { body } = require("express-validator");



const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());


mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((res) => console.log("MONGODB is connected"))
  .catch((err) => console.log(err));

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", brainTreePaymentRoute);



app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
