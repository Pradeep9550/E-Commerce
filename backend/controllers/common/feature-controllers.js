const Feature = require("../../models/Feature.model.js");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const newImage = await Feature.create({ image }); // ⚡ faster

    return res.status(201).json({
      success: true,
      data: newImage,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({})
      .sort({ createdAt: -1 }) // latest first ⚡
      .select("image createdAt") // minimal data ⚡
      .lean(); // 🔥 big performance boost

    return res.status(200).json({
      success: true,
      data: images,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages };