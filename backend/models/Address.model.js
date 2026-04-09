const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true, // ⚡ fast query
      required: true,
    },
    address: { type: String, required: true },
    city: { type: String, index: true },
    pincode: { type: String, index: true },
    phone: { type: String, required: true },
    notes: String,
  },
  { timestamps: true }
);

// compound index (🔥 super fast)
AddressSchema.index({ userId: 1, _id: 1 });

module.exports = mongoose.model("Address", AddressSchema);