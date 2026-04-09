const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// ⚡ fast retrieval (latest first)
FeatureSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Feature", FeatureSchema);