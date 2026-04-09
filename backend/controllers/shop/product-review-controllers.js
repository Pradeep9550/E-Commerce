const Product = require("../../models/Product.model");
const Order = require("../../models/Orders.model");
const ProductReview = require("../../models/Review.model");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    // ✅ check purchase (fast)
    const hasPurchased = await Order.exists({
      userId,
      "cartItems.productId": productId,
    });

    if (!hasPurchased) {
      return res.status(403).json({ success: false });
    }

    const alreadyReviewed = await ProductReview.exists({
      productId,
      userId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false });
    }

    const review = await ProductReview.create({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    // ⚡ aggregation (FAST)
    const result = await ProductReview.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$productId",
          avg: { $avg: "$reviewValue" },
        },
      },
    ]);

    await Product.findByIdAndUpdate(productId, {
      averageReview: result[0]?.avg || 0,
    });

    return res.status(201).json({
      success: true,
      data: review,
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find({ productId: req.params.productId })
      .select("userName reviewMessage reviewValue createdAt")
      .lean();

    return res.status(200).json({
      success: true,
      data: reviews,
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { addProductReview, getProductReviews };
