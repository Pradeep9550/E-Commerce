const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        title: String,
        image: String,
        price: Number, // ✅ fixed
        quantity: Number,
      },
    ],
    addressInfo: {
      addressId: String,
      address: String,
      city: String,
      pincode: String,
      phone: String,
      notes: String,
    },
    orderStatus: {
      type: String,
      index: true,
    },
    paymentMethod: String,
    paymentStatus: {
      type: String,
      index: true,
    },
    totalAmount: Number,
    paymentId: String,
    payerId: String,
    orderDate: Date,
  orderUpdateDate: Date,
  },
  { timestamps: true }
);

// ⚡ compound index
OrderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Order", OrderSchema);