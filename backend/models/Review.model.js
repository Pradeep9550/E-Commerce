const mongoose = require("mongoose");

const ProductReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: String,
    reviewMessage: String,
    reviewValue: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

// 🔥 prevent duplicate reviews
ProductReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("ProductReview", ProductReviewSchema);