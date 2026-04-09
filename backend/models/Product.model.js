const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      index: true, // ⚡ search fast
      trim: true,
    },
    description: String,
    category: {
      type: String,
      index: true, // ⚡ filter fast
    },
    brand: {
      type: String,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    totalStock: {
      type: Number,
      default: 0,
    },
    averageReview: {
      type: Number,
      default: 0,
      index: true, // ⚡ sort fast
    },
  },
  { timestamps: true }
);

// 🔥 compound index (filters + sorting fast)
ProductSchema.index({ category: 1, brand: 1 });
ProductSchema.index({
  title: "text",
  description: "text",
  category: "text",
  brand: "text",
});

module.exports = mongoose.model("Product", ProductSchema);