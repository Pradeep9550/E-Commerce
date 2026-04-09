const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product.model.js")





const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file" });
    }

    const result = await imageUploadUtil(req.file.buffer);

    return res.status(200).json({
      success: true,
      url: result.secure_url,
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//add a new product
 const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body); // ⚡ faster

    return res.status(201).json({
      success: true,
      data: product,
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

 // fetch all products
 const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .select("title price salePrice image category brand")
      .lean(); // ⚡

    return res.status(200).json({
      success: true,
      data: products,
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

  // edit a Product

const editProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false });
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

 //delete a Product
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false });
    }

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};



module.exports = {handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct}