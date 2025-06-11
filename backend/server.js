const express = require('express');
const dotenv = require("dotenv")
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require("./routes/auth/auth.routes.js");
const adminProductsRouter = require("./routes/admin/products-routes.js");
const adminOrdersRouter = require("./routes/admin/order-routes.js");

const shopProductsRouter = require('./routes/shop/products-routes.js');
const shopCartRouter = require('./routes/shop/cart-routes.js');
const shopAddressRouter = require('./routes/shop/address-routes.js');
const shopOrderRouter = require('./routes/shop/order-routes.js');
const shopSearchRouter = require('./routes/shop/search-routes.js');
const shopReviewRouter = require('./routes/shop/review-routes.js');

const commonFeatureRouter = require("./routes/common/feature-routes.js")

dotenv.config();


mongoose.connect(process.env.MONGO_DB_URL)
.then(() => console.log("MongoDB Connected"))
.catch((error) => console.log(error));

const app = express();

app.options('*', cors());

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://e-commerce-frontend-xtf6.onrender.com'],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrdersRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);



app.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}`);
});


