const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ fixed
      required: true,
      index: true, // ⚡ fast query
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

// ⚡ compound index (VERY IMPORTANT)
CartSchema.index({ userId: 1, "items.productId": 1 });

module.exports = mongoose.model("Cart", CartSchema);